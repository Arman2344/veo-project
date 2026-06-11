"""Smart Personal Expense Tracker XL — generates expense_tracker.xlsx"""

from datetime import date
from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side, Protection
)
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.chart import LineChart, BarChart, PieChart, Reference
from openpyxl.chart.series import SeriesLabel
from openpyxl.workbook.defined_name import DefinedName

# ── Design Tokens ──────────────────────────────────────────────────────────────
DARK_BLUE  = "1B2A4A"
EMERALD    = "2ECC71"
WHITE      = "FFFFFF"
SOFT_GRAY  = "F5F6FA"
LIGHT_BLUE = "3498DB"
LIGHT_GRAY = "F9F9F9"
RED_ALERT  = "E74C3C"
ORANGE     = "F39C12"
GOLD       = "F1C40F"
PURPLE     = "8E44AD"
DARK_BLUE2 = "2980B9"

CHF_FORMAT  = '"CHF" #,##0.00'
DATE_FORMAT = "DD/MM/YYYY"
PCT_FORMAT  = "0.0%"

CATEGORIES = [
    "Food", "Vegetables", "Meat", "Fish", "Protein", "Snacks", "Drinks",
    "Transport", "Health", "Supplements", "Household", "Electronics",
    "Clothing", "Entertainment", "Other"
]
PAYMENT_METHODS = ["Cash", "Card", "TWINT", "Bank Transfer"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

SAMPLE_DATA = [
    (date(2024, 1, 3),  "Migros Weekly Shop",    "Food",          "Migros",        1, 87.50, "Card",          "Weekly groceries"),
    (date(2024, 1, 5),  "SBB Monthly Pass",      "Transport",     "SBB",           1, 86.00, "Bank Transfer", "Public transport"),
    (date(2024, 1, 7),  "Chicken Breast 1kg",    "Meat",          "Coop",          2, 12.90, "Card",          "Protein source"),
    (date(2024, 1, 9),  "Protein Powder",        "Supplements",   "Sportxx",       1, 49.90, "Card",          "Whey protein"),
    (date(2024, 1, 10), "Pharmacy Visit",        "Health",        "Apotheke",      1, 23.40, "Cash",          "Cold medicine"),
    (date(2024, 1, 12), "Netflix",               "Entertainment", "Netflix",       1, 17.90, "Card",          "Monthly sub"),
    (date(2024, 1, 14), "Fresh Vegetables",      "Vegetables",    "Coop",          1, 18.60, "Card",          "Weekly veg"),
    (date(2024, 1, 16), "iPhone Cable",          "Electronics",   "Media Markt",   1, 29.00, "Card",          "Replacement"),
    (date(2024, 1, 18), "Gym Membership",        "Health",        "Fitness Park",  1, 65.00, "Bank Transfer", "Monthly fee"),
    (date(2024, 1, 20), "Red Bull 4-pack",       "Drinks",        "Migros",        2,  6.50, "Cash",          "Energy drinks"),
]

# ── Shared Style Objects ───────────────────────────────────────────────────────
def _fill(color):
    return PatternFill(start_color=color, end_color=color, fill_type="solid")

def _border(style="thin", color=DARK_BLUE):
    s = Side(style=style, color=color)
    return Border(left=s, right=s, top=s, bottom=s)

def _font(bold=False, size=11, color=WHITE, name="Calibri"):
    return Font(name=name, bold=bold, size=size, color=color)

HEADER_FONT    = _font(bold=True, size=14, color=WHITE)
SUBHEADER_FONT = _font(bold=True, size=11, color=WHITE)
BODY_FONT      = _font(color="000000")
TITLE_FONT     = _font(bold=True, size=16, color=WHITE)

HEADER_FILL  = _fill(DARK_BLUE)
ALT_FILL     = _fill(LIGHT_GRAY)
INNER_BORDER = _border("thin", DARK_BLUE)
MED_BORDER   = _border("medium", DARK_BLUE)


# ── Helpers ────────────────────────────────────────────────────────────────────
def apply_sheet_title_row(ws, title, col_count):
    end_col = get_column_letter(col_count)
    ws.merge_cells(f"A1:{end_col}1")
    cell = ws["A1"]
    cell.value = title
    cell.font = TITLE_FONT
    cell.fill = HEADER_FILL
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = _border("medium", DARK_BLUE)
    ws.row_dimensions[1].height = 42


def apply_column_header_row(ws, headers, row_num=2, fill_color=DARK_BLUE):
    fill = _fill(fill_color)
    for col_idx, header in enumerate(headers, 1):
        cell = ws.cell(row=row_num, column=col_idx, value=header)
        cell.font = SUBHEADER_FONT
        cell.fill = fill
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = INNER_BORDER
    ws.row_dimensions[row_num].height = 30


def style_data_row(ws, row_num, col_count, alt=False):
    fill = ALT_FILL if alt else _fill(WHITE)
    for col_idx in range(1, col_count + 1):
        cell = ws.cell(row=row_num, column=col_idx)
        if cell.value is None and col_idx not in [7]:
            pass
        cell.fill = fill
        cell.border = INNER_BORDER
        if cell.font == Font():
            cell.font = BODY_FONT


def _card(ws, merge_range, label, formula, fill_color,
          label_row_offset=0, value_row_offset=2, is_text=False):
    """Creates a styled summary card using two separate merged regions for label+value."""
    import re
    from openpyxl.utils import column_index_from_string
    m = re.match(r"([A-Z]+)(\d+):([A-Z]+)(\d+)", merge_range)
    if not m:
        return
    col_start = m.group(1)
    col_end   = m.group(3)
    r1 = int(m.group(2))
    r2 = int(m.group(4))
    c1 = column_index_from_string(col_start)
    c2 = column_index_from_string(col_end)
    mid_row = r1 + 1   # label on first 2 rows, value on last 2 rows

    # Fill all individual cells before merging (merge makes them read-only)
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            cell = ws.cell(row=r, column=c)
            cell.fill = _fill(fill_color)

    # Label region: r1 to mid_row
    label_range = f"{col_start}{r1}:{col_end}{mid_row}"
    ws.merge_cells(label_range)
    label_cell = ws[f"{col_start}{r1}"]
    label_cell.value = label
    label_cell.font = Font(name="Calibri", bold=True, size=9, color=SOFT_GRAY)
    label_cell.alignment = Alignment(horizontal="center", vertical="bottom")
    label_cell.border = Border(
        left=Side(style="medium", color=fill_color),
        right=Side(style="medium", color=fill_color),
        top=Side(style="medium", color=fill_color),
    )

    # Value region: mid_row+1 to r2
    val_range = f"{col_start}{mid_row + 1}:{col_end}{r2}"
    ws.merge_cells(val_range)
    val_cell = ws[f"{col_start}{mid_row + 1}"]
    val_cell.value = formula
    val_cell.font = Font(name="Calibri", bold=True, size=20, color=WHITE)
    val_cell.alignment = Alignment(horizontal="center", vertical="center")
    val_cell.border = Border(
        left=Side(style="medium", color=fill_color),
        right=Side(style="medium", color=fill_color),
        bottom=Side(style="medium", color=fill_color),
    )
    if is_text:
        val_cell.number_format = "@"
    else:
        val_cell.number_format = CHF_FORMAT


# ── Sheet Builders ─────────────────────────────────────────────────────────────

def build_daily_expenses(ws):
    ws.sheet_view.zoomScale = 90

    COL_WIDTHS = {"A": 14, "B": 28, "C": 16, "D": 20,
                  "E": 10, "F": 15, "G": 15, "H": 17, "I": 32}
    for col, width in COL_WIDTHS.items():
        ws.column_dimensions[col].width = width

    # Header row
    HEADERS = ["Date", "Product Name", "Category", "Store Name",
               "Quantity", "Price Per Unit", "Total Price", "Payment Method", "Notes"]
    for col_idx, header in enumerate(HEADERS, 1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = INNER_BORDER
    ws.row_dimensions[1].height = 36

    # Sample data rows
    for row_idx, (dt, product, cat, store, qty, price, payment, notes) in enumerate(SAMPLE_DATA, 2):
        ws.cell(row=row_idx, column=1, value=dt).number_format = DATE_FORMAT
        ws.cell(row=row_idx, column=2, value=product)
        ws.cell(row=row_idx, column=3, value=cat)
        ws.cell(row=row_idx, column=4, value=store)
        ws.cell(row=row_idx, column=5, value=qty)
        price_cell = ws.cell(row=row_idx, column=6, value=price)
        price_cell.number_format = CHF_FORMAT
        ws.cell(row=row_idx, column=8, value=payment)
        ws.cell(row=row_idx, column=9, value=notes)
        for col_idx in range(1, 10):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = BODY_FONT
            cell.border = INNER_BORDER
            if row_idx % 2 == 0:
                cell.fill = ALT_FILL
        ws.row_dimensions[row_idx].height = 20

    # Total Price formula — all 200 rows
    for row_num in range(2, 202):
        cell = ws.cell(row=row_num, column=7)
        cell.value = f'=IF(OR(E{row_num}="",F{row_num}=""),"",E{row_num}*F{row_num})'
        cell.number_format = CHF_FORMAT
        cell.font = BODY_FONT
        cell.border = INNER_BORDER
        cell.protection = Protection(locked=True)
        if row_num % 2 == 0:
            cell.fill = ALT_FILL

    # Unlock all input columns for rows 2-201
    for row_num in range(2, 202):
        for col_idx in [1, 2, 3, 4, 5, 6, 8, 9]:
            ws.cell(row=row_num, column=col_idx).protection = Protection(locked=False)

    # Excel Table
    tab = Table(displayName="ExpenseTable", ref="A1:I201")
    tab.tableStyleInfo = TableStyleInfo(
        name="TableStyleMedium9",
        showFirstColumn=False,
        showLastColumn=False,
        showRowStripes=True,
        showColumnStripes=False
    )
    ws.add_table(tab)

    # Data Validation — Category
    cat_list = ",".join(CATEGORIES)
    dv_cat = DataValidation(
        type="list",
        formula1=f'"{cat_list}"',
        allow_blank=True,
        showDropDown=False,
        showErrorMessage=True,
        error="Please select from the list",
        errorTitle="Invalid Category",
        showInputMessage=True,
        prompt="Select a category",
        promptTitle="Category"
    )
    dv_cat.sqref = "C2:C201"
    ws.add_data_validation(dv_cat)

    # Data Validation — Payment Method
    pay_list = ",".join(PAYMENT_METHODS)
    dv_pay = DataValidation(
        type="list",
        formula1=f'"{pay_list}"',
        allow_blank=True,
        showDropDown=False,
        showErrorMessage=True,
        error="Please select from the list",
        errorTitle="Invalid Payment Method"
    )
    dv_pay.sqref = "H2:H201"
    ws.add_data_validation(dv_pay)

    # Conditional Formatting — high value (>100 CHF)
    red_font = Font(name="Calibri", size=11, bold=True, color=WHITE)
    ws.conditional_formatting.add(
        "G2:G201",
        CellIsRule(operator="greaterThan", formula=["100"],
                   fill=_fill(RED_ALERT), font=red_font)
    )

    # Sheet protection
    ws.protection.sheet = True
    ws.protection.password = "tracker2024"
    ws.protection.sort = False
    ws.protection.autoFilter = False
    ws.protection.selectLockedCells = False
    ws.protection.selectUnlockedCells = False

    ws.freeze_panes = "A2"


def build_monthly_summary(ws):
    apply_sheet_title_row(ws, "Monthly Expense Summary", 8)

    HEADERS = ["Month", "Total Spending", "Transactions", "Avg Daily",
               "Highest Expense", "Budget", "% Used", "Status"]
    apply_column_header_row(ws, HEADERS, row_num=2)

    COL_WIDTHS = {"A": 10, "B": 16, "C": 14, "D": 14,
                  "E": 16, "F": 14, "G": 10, "H": 16}
    for col, width in COL_WIDTHS.items():
        ws.column_dimensions[col].width = width

    de = "'Daily Expenses'"

    for row_num in range(3, 15):
        m = row_num - 2
        ws.cell(row=row_num, column=1, value=MONTHS[m - 1])

        # B: Monthly total
        ws.cell(row=row_num, column=2).value = (
            f"=SUMPRODUCT(({de}!$G$2:$G$201)*"
            f"(MONTH({de}!$A$2:$A$201)={m})*"
            f"(YEAR({de}!$A$2:$A$201)=YEAR(TODAY())))"
        )
        # C: Transaction count
        ws.cell(row=row_num, column=3).value = (
            f"=SUMPRODUCT((MONTH({de}!$A$2:$A$201)={m})*"
            f"(YEAR({de}!$A$2:$A$201)=YEAR(TODAY()))*"
            f"({de}!$G$2:$G$201<>\"\"))"
        )
        # D: Average daily
        ws.cell(row=row_num, column=4).value = (
            f"=IFERROR(B{row_num}/DAY(EOMONTH(DATE(YEAR(TODAY()),{m},1),0)),0)"
        )
        # E: Highest single expense
        ws.cell(row=row_num, column=5).value = (
            f"=IFERROR(MAXIFS({de}!$G$2:$G$201,"
            f"{de}!$A$2:$A$201,\">=\"&DATE(YEAR(TODAY()),{m},1),"
            f"{de}!$A$2:$A$201,\"<\"&DATE(YEAR(TODAY()),{m}+1,1)),0)"
        )
        # F: Budget (pulls from Budget Tracking)
        ws.cell(row=row_num, column=6).value = "='Budget Tracking'!B5"
        # G: % used
        ws.cell(row=row_num, column=7).value = f"=IFERROR(B{row_num}/F{row_num},0)"
        ws.cell(row=row_num, column=7).number_format = PCT_FORMAT
        # H: Status
        ws.cell(row=row_num, column=8).value = (
            f'=IF(G{row_num}>1,"Over Budget ▲",'
            f'IF(G{row_num}>0.8,"Near Limit ⚠","On Track ✓"))'
        )

        for col_idx in [2, 4, 5, 6]:
            ws.cell(row=row_num, column=col_idx).number_format = CHF_FORMAT

        for col_idx in range(1, 9):
            cell = ws.cell(row=row_num, column=col_idx)
            cell.font = BODY_FONT
            cell.border = INNER_BORDER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            if row_num % 2 == 0:
                cell.fill = ALT_FILL
        ws.row_dimensions[row_num].height = 20

    # Annual totals row 15
    ws.cell(row=15, column=1, value="TOTAL")
    ws.cell(row=15, column=2).value = "=SUM(B3:B14)"
    ws.cell(row=15, column=3).value = "=SUM(C3:C14)"
    ws.cell(row=15, column=4).value = "=IFERROR(B15/SUMPRODUCT((B3:B14>0)*DAY(EOMONTH(DATE(YEAR(TODAY()),ROW(INDIRECT(\"1:12\")),1),0))),0)"
    ws.cell(row=15, column=5).value = "=MAX(E3:E14)"
    for col_idx in [2, 4, 5]:
        ws.cell(row=15, column=col_idx).number_format = CHF_FORMAT
    for col_idx in range(1, 9):
        cell = ws.cell(row=15, column=col_idx)
        cell.font = Font(name="Calibri", bold=True, size=11, color=WHITE)
        cell.fill = _fill(DARK_BLUE)
        cell.border = INNER_BORDER
        cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[15].height = 22

    # ── Category Breakdown sub-table ──────────────────────────────────────────
    ws.row_dimensions[17].height = 20
    ws.merge_cells("A17:N17")
    header17 = ws["A17"]
    header17.value = "Category Breakdown by Month"
    header17.font = Font(name="Calibri", bold=True, size=13, color=WHITE)
    header17.fill = _fill(LIGHT_BLUE)
    header17.alignment = Alignment(horizontal="center", vertical="center")

    cat_headers = ["Category"] + MONTHS
    apply_column_header_row(ws, cat_headers, row_num=18, fill_color=DARK_BLUE2)
    ws.column_dimensions["A"].width = 16
    for col_letter in [get_column_letter(i) for i in range(2, 14)]:
        ws.column_dimensions[col_letter].width = 10

    for cat_row, cat in enumerate(CATEGORIES, 19):
        ws.cell(row=cat_row, column=1, value=cat)
        for col_idx, month_num in enumerate(range(1, 13), 2):
            cell = ws.cell(row=cat_row, column=col_idx)
            cell.value = (
                f"=SUMPRODUCT(({de}!$G$2:$G$201)*"
                f"(MONTH({de}!$A$2:$A$201)={month_num})*"
                f"(YEAR({de}!$A$2:$A$201)=YEAR(TODAY()))*"
                f"({de}!$C$2:$C$201=\"{cat}\"))"
            )
            cell.number_format = CHF_FORMAT
            cell.font = BODY_FONT
            cell.border = INNER_BORDER
            cell.alignment = Alignment(horizontal="right", vertical="center")
            if cat_row % 2 == 0:
                cell.fill = ALT_FILL
        ws.cell(row=cat_row, column=1).font = BODY_FONT
        ws.cell(row=cat_row, column=1).border = INNER_BORDER
        ws.row_dimensions[cat_row].height = 18

    ws.freeze_panes = "B3"
    ws.sheet_view.zoomScale = 90


def build_category_analysis(ws):
    apply_sheet_title_row(ws, "Category Analysis", 5)

    HEADERS = ["Category", "Total Spending", "% of Total", "Transactions", "Avg / Transaction"]
    apply_column_header_row(ws, HEADERS, row_num=2)

    COL_WIDTHS = {"A": 18, "B": 16, "C": 12, "D": 14, "E": 18}
    for col, width in COL_WIDTHS.items():
        ws.column_dimensions[col].width = width

    de = "'Daily Expenses'"

    for row_num, cat in enumerate(CATEGORIES, 3):
        ws.cell(row=row_num, column=1, value=cat)
        ws.cell(row=row_num, column=2).value = (
            f"=SUMIF({de}!$C:$C,\"{cat}\",{de}!$G:$G)"
        )
        ws.cell(row=row_num, column=3).value = (
            f"=IFERROR(B{row_num}/SUM({de}!$G$2:$G$201),0)"
        )
        ws.cell(row=row_num, column=4).value = (
            f"=COUNTIF({de}!$C:$C,\"{cat}\")"
        )
        ws.cell(row=row_num, column=5).value = (
            f"=IFERROR(B{row_num}/D{row_num},0)"
        )
        ws.cell(row=row_num, column=2).number_format = CHF_FORMAT
        ws.cell(row=row_num, column=3).number_format = PCT_FORMAT
        ws.cell(row=row_num, column=5).number_format = CHF_FORMAT

        for col_idx in range(1, 6):
            cell = ws.cell(row=row_num, column=col_idx)
            cell.font = BODY_FONT
            cell.border = INNER_BORDER
            cell.alignment = Alignment(horizontal="center" if col_idx > 1 else "left",
                                       vertical="center")
            if row_num % 2 == 0:
                cell.fill = ALT_FILL
        ws.row_dimensions[row_num].height = 20

    # Totals row (row 18)
    ws.cell(row=18, column=1, value="TOTAL")
    ws.cell(row=18, column=2).value = f"=SUM({de}!$G$2:$G$201)"
    ws.cell(row=18, column=3).value = "=SUM(C3:C17)"
    ws.cell(row=18, column=4).value = f"=COUNTA({de}!$C$2:$C$201)"
    ws.cell(row=18, column=5).value = "=IFERROR(B18/D18,0)"
    ws.cell(row=18, column=2).number_format = CHF_FORMAT
    ws.cell(row=18, column=3).number_format = PCT_FORMAT
    ws.cell(row=18, column=5).number_format = CHF_FORMAT
    for col_idx in range(1, 6):
        cell = ws.cell(row=18, column=col_idx)
        cell.font = Font(name="Calibri", bold=True, size=11, color=WHITE)
        cell.fill = _fill(DARK_BLUE)
        cell.border = INNER_BORDER
        cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[18].height = 22

    # Highlight max category (gold)
    gold_fill = _fill(GOLD)
    bold_dark = Font(name="Calibri", bold=True, size=11, color=DARK_BLUE)
    ws.conditional_formatting.add(
        "A3:E17",
        FormulaRule(formula=["$B3=MAX($B$3:$B$17)"],
                    fill=gold_fill, font=bold_dark)
    )

    ws.freeze_panes = "A3"
    ws.sheet_view.zoomScale = 90


def build_budget_tracking(ws):
    apply_sheet_title_row(ws, "Budget Tracking & Alerts", 7)

    ws.column_dimensions["A"].width = 20
    ws.column_dimensions["B"].width = 14
    ws.column_dimensions["C"].width = 14
    ws.column_dimensions["D"].width = 14
    ws.column_dimensions["E"].width = 14
    ws.column_dimensions["F"].width = 12
    ws.column_dimensions["G"].width = 20

    de = "'Daily Expenses'"

    # Section header row 3
    ws.merge_cells("A3:G3")
    h3 = ws["A3"]
    h3.value = "Budget vs. Actual Spending"
    h3.font = Font(name="Calibri", bold=True, size=12, color=WHITE)
    h3.fill = _fill(DARK_BLUE2)
    h3.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[3].height = 28

    # Column headers row 4
    col_hdrs = ["Period", "Budget (CHF)", "Spent (CHF)", "Remaining", "% Used", "", "Status"]
    apply_column_header_row(ws, col_hdrs, row_num=4, fill_color=DARK_BLUE)

    # Period rows
    PERIODS = [
        (5, "Monthly Budget",
         f"=SUMPRODUCT((MONTH({de}!$A$2:$A$201)=MONTH(TODAY()))*(YEAR({de}!$A$2:$A$201)=YEAR(TODAY()))*{de}!$G$2:$G$201)",
         3000),
        (7, "Weekly Budget",
         f"=SUMPRODUCT(({de}!$A$2:$A$201>=TODAY()-WEEKDAY(TODAY(),2)+1)*({de}!$A$2:$A$201<=TODAY()-WEEKDAY(TODAY(),2)+7)*{de}!$G$2:$G$201)",
         700),
        (9, "Daily Average",
         f"=IFERROR(SUMPRODUCT(({de}!$G$2:$G$201<>\"\")*{de}!$G$2:$G$201)/SUMPRODUCT(--({de}!$G$2:$G$201<>\"\")),0)",
         100),
    ]

    input_fill = _fill("D6EAF8")
    input_font = Font(name="Calibri", bold=True, size=13, color=DARK_BLUE)

    for row_num, label, spent_formula, default_budget in PERIODS:
        ws.row_dimensions[row_num].height = 32
        ws.cell(row=row_num, column=1, value=label).font = Font(name="Calibri", bold=True, size=12, color=DARK_BLUE)
        ws.cell(row=row_num, column=1).border = INNER_BORDER

        # Budget input cell
        budget_cell = ws.cell(row=row_num, column=2, value=default_budget)
        budget_cell.font = input_font
        budget_cell.fill = input_fill
        budget_cell.border = _border("medium", LIGHT_BLUE)
        budget_cell.alignment = Alignment(horizontal="center", vertical="center")
        budget_cell.number_format = CHF_FORMAT
        budget_cell.protection = Protection(locked=False)

        # Spent
        ws.cell(row=row_num, column=3).value = spent_formula
        ws.cell(row=row_num, column=3).number_format = CHF_FORMAT
        ws.cell(row=row_num, column=3).border = INNER_BORDER
        ws.cell(row=row_num, column=3).font = BODY_FONT
        ws.cell(row=row_num, column=3).alignment = Alignment(horizontal="center", vertical="center")

        # Remaining
        ws.cell(row=row_num, column=4).value = f"=B{row_num}-C{row_num}"
        ws.cell(row=row_num, column=4).number_format = CHF_FORMAT
        ws.cell(row=row_num, column=4).border = INNER_BORDER
        ws.cell(row=row_num, column=4).font = BODY_FONT
        ws.cell(row=row_num, column=4).alignment = Alignment(horizontal="center", vertical="center")

        # % Used
        ws.cell(row=row_num, column=5).value = f"=IFERROR(C{row_num}/B{row_num},0)"
        ws.cell(row=row_num, column=5).number_format = PCT_FORMAT
        ws.cell(row=row_num, column=5).border = INNER_BORDER
        ws.cell(row=row_num, column=5).alignment = Alignment(horizontal="center", vertical="center")

        # Empty col F separator
        ws.cell(row=row_num, column=6).border = INNER_BORDER

        # Status alert
        ws.cell(row=row_num, column=7).value = (
            f'=IF(E{row_num}>1,"🔴 OVER BUDGET!",'
            f'IF(E{row_num}>0.8,"🟡 WARNING — Near Limit","🟢 On Track"))'
        )
        ws.cell(row=row_num, column=7).font = Font(name="Calibri", bold=True, size=11, color=DARK_BLUE)
        ws.cell(row=row_num, column=7).border = INNER_BORDER
        ws.cell(row=row_num, column=7).alignment = Alignment(horizontal="center", vertical="center")

    # Conditional formatting on % used column (E)
    ws.conditional_formatting.add("E5:E9",
        CellIsRule(operator="greaterThan", formula=["1"], fill=_fill(RED_ALERT),
                   font=Font(name="Calibri", bold=True, color=WHITE)))
    ws.conditional_formatting.add("E5:E9",
        CellIsRule(operator="between", formula=["0.8", "1"], fill=_fill(ORANGE),
                   font=Font(name="Calibri", bold=True, color=WHITE)))
    ws.conditional_formatting.add("E5:E9",
        CellIsRule(operator="lessThan", formula=["0.8"], fill=_fill(EMERALD),
                   font=Font(name="Calibri", bold=True, color=WHITE)))

    # Tips section
    ws.row_dimensions[11].height = 10
    ws.merge_cells("A12:G12")
    tip_header = ws["A12"]
    tip_header.value = "Budget Tips"
    tip_header.font = Font(name="Calibri", bold=True, size=11, color=WHITE)
    tip_header.fill = _fill(DARK_BLUE)
    tip_header.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[12].height = 24

    tips = [
        "• Edit the Budget (CHF) cells in column B to set your personal targets.",
        "• All spending figures update automatically from the Daily Expenses sheet.",
        "• Green = under 80% used   |   Yellow = 80-100%   |   Red = over budget",
    ]
    for i, tip in enumerate(tips, 13):
        ws.merge_cells(f"A{i}:G{i}")
        cell = ws[f"A{i}"]
        cell.value = tip
        cell.font = Font(name="Calibri", size=10, color=DARK_BLUE)
        cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws.row_dimensions[i].height = 20

    ws.protection.sheet = True
    ws.protection.password = "tracker2024"
    ws.protection.selectUnlockedCells = False

    ws.sheet_view.zoomScale = 95


def build_dashboard(ws, ws_monthly, ws_cat):
    ws.sheet_view.zoomScale = 85

    # Title banner
    ws.merge_cells("A1:P1")
    title_cell = ws["A1"]
    title_cell.value = "Smart Personal Expense Tracker XL  |  Dashboard"
    title_cell.font = Font(name="Calibri", bold=True, size=18, color=WHITE)
    title_cell.fill = _fill(DARK_BLUE)
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 50

    # Set column widths for card layout
    for col_letter in ["A", "B", "C", "D", "E", "F"]:
        ws.column_dimensions[col_letter].width = 3
    for col_letter in ["G", "H", "I", "J", "K", "L"]:
        ws.column_dimensions[col_letter].width = 3
    for col_letter in ["M", "N", "O", "P"]:
        ws.column_dimensions[col_letter].width = 3
    # Give cards some breathing room
    for i in range(1, 17):
        ws.column_dimensions[get_column_letter(i)].width = 13

    for r in range(2, 12):
        ws.row_dimensions[r].height = 22

    de = "'Daily Expenses'"

    # 6 Summary Cards (2 rows × 3 cards)
    # Row 1 of cards: B2:F5, H2:L5, N2:P5  → Monthly, Weekly, Daily
    cards_row1 = [
        ("B2:F5", "MONTHLY SPENDING",
         f"=SUMPRODUCT((MONTH({de}!$A$2:$A$201)=MONTH(TODAY()))*(YEAR({de}!$A$2:$A$201)=YEAR(TODAY()))*{de}!$G$2:$G$201)",
         DARK_BLUE, False),
        ("H2:L5", "WEEKLY SPENDING",
         f"=SUMPRODUCT(({de}!$A$2:$A$201>=TODAY()-WEEKDAY(TODAY(),2)+1)*({de}!$A$2:$A$201<=TODAY()-WEEKDAY(TODAY(),2)+7)*{de}!$G$2:$G$201)",
         LIGHT_BLUE, False),
        ("N2:P5", "DAILY AVERAGE",
         f"=IFERROR(SUMPRODUCT(({de}!$G$2:$G$201<>\"\")*{de}!$G$2:$G$201)/SUMPRODUCT(--({de}!$G$2:$G$201<>\"\")),0)",
         DARK_BLUE2, False),
    ]
    cards_row2 = [
        ("B7:F10", "REMAINING BUDGET",
         f"=IFERROR('Budget Tracking'!B5-SUMPRODUCT((MONTH({de}!$A$2:$A$201)=MONTH(TODAY()))*(YEAR({de}!$A$2:$A$201)=YEAR(TODAY()))*{de}!$G$2:$G$201),0)",
         EMERALD, False),
        ("H7:L10", "TOP CATEGORY",
         "=IFERROR(INDEX('Category Analysis'!$A$3:$A$17,MATCH(MAX('Category Analysis'!$B$3:$B$17),'Category Analysis'!$B$3:$B$17,0)),\"N/A\")",
         PURPLE, True),
        ("N7:P10", "TOTAL EXPENSES",
         f"=IFERROR(SUM({de}!$G$2:$G$201),0)",
         RED_ALERT, False),
    ]

    for merge_range, label, formula, fill_color, is_text in cards_row1 + cards_row2:
        _card(ws, merge_range, label, formula, fill_color, is_text=is_text)

    # Spacer row
    ws.row_dimensions[11].height = 10

    # Section header for charts
    ws.merge_cells("B12:P12")
    ch = ws["B12"]
    ch.value = "Expense Analytics"
    ch.font = Font(name="Calibri", bold=True, size=13, color=WHITE)
    ch.fill = _fill(DARK_BLUE)
    ch.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[12].height = 28

    # Chart 1: Monthly Expense Trend (Line)
    lc = LineChart()
    lc.title = "Monthly Expense Trend"
    lc.style = 10
    lc.height = 12
    lc.width = 22
    lc.y_axis.title = "CHF"
    lc.x_axis.title = "Month"
    data = Reference(ws_monthly, min_col=2, min_row=2, max_row=14)
    cats = Reference(ws_monthly, min_col=1, min_row=3, max_row=14)
    lc.add_data(data, titles_from_data=True)
    lc.set_categories(cats)
    if lc.series:
        lc.series[0].smooth = True
    ws.add_chart(lc, "B13")

    # Chart 2: Category Pie
    pc = PieChart()
    pc.title = "Spending by Category"
    pc.style = 10
    pc.height = 12
    pc.width = 14
    data_pie = Reference(ws_cat, min_col=2, min_row=2, max_row=17)
    labels_pie = Reference(ws_cat, min_col=1, min_row=3, max_row=17)
    pc.add_data(data_pie, titles_from_data=True)
    pc.set_categories(labels_pie)
    ws.add_chart(pc, "B28")

    # Chart 3: Monthly Bar
    bc = BarChart()
    bc.type = "col"
    bc.grouping = "clustered"
    bc.title = "Monthly Totals"
    bc.style = 10
    bc.height = 12
    bc.width = 16
    bc.y_axis.title = "CHF"
    data_bar = Reference(ws_monthly, min_col=2, min_row=2, max_row=14)
    cats_bar = Reference(ws_monthly, min_col=1, min_row=3, max_row=14)
    bc.add_data(data_bar, titles_from_data=True)
    bc.set_categories(cats_bar)
    ws.add_chart(bc, "J28")


def build_charts_analytics(ws, ws_monthly, ws_cat):
    ws.merge_cells("A1:Z1")
    title = ws["A1"]
    title.value = "Charts & Analytics"
    title.font = TITLE_FONT
    title.fill = _fill(DARK_BLUE)
    title.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 42

    de = "'Daily Expenses'"

    # Helper store comparison table (hidden cols S:T, start row 2 to avoid merged title)
    TOP_STORES = ["Migros", "Coop", "SBB", "Apotheke",
                  "Sportxx", "Media Markt", "Netflix", "Fitness Park"]
    ws.cell(row=2, column=19, value="Store")
    ws.cell(row=2, column=20, value="Total")
    for row_num, store in enumerate(TOP_STORES, 3):
        ws.cell(row=row_num, column=19, value=store)
        ws.cell(row=row_num, column=20).value = (
            f"=SUMIF({de}!$D:$D,\"{store}\",{de}!$G:$G)"
        )
    ws.column_dimensions["S"].hidden = True
    ws.column_dimensions["T"].hidden = True

    # Chart 1: Monthly Line (large)
    lc = LineChart()
    lc.title = "Monthly Expense Trend"
    lc.style = 10
    lc.height = 14
    lc.width = 24
    lc.y_axis.title = "CHF"
    data = Reference(ws_monthly, min_col=2, min_row=2, max_row=14)
    cats = Reference(ws_monthly, min_col=1, min_row=3, max_row=14)
    lc.add_data(data, titles_from_data=True)
    lc.set_categories(cats)
    if lc.series:
        lc.series[0].smooth = True
    ws.add_chart(lc, "A2")

    # Chart 2: Monthly Bar
    bc = BarChart()
    bc.type = "col"
    bc.grouping = "clustered"
    bc.title = "Monthly Totals (Bar)"
    bc.style = 10
    bc.height = 14
    bc.width = 22
    bc.y_axis.title = "CHF"
    data_bar = Reference(ws_monthly, min_col=2, min_row=2, max_row=14)
    cats_bar = Reference(ws_monthly, min_col=1, min_row=3, max_row=14)
    bc.add_data(data_bar, titles_from_data=True)
    bc.set_categories(cats_bar)
    ws.add_chart(bc, "M2")

    # Chart 3: Category Pie (large)
    pc = PieChart()
    pc.title = "Category Distribution"
    pc.style = 10
    pc.height = 14
    pc.width = 22
    data_pie = Reference(ws_cat, min_col=2, min_row=2, max_row=17)
    labels_pie = Reference(ws_cat, min_col=1, min_row=3, max_row=17)
    pc.add_data(data_pie, titles_from_data=True)
    pc.set_categories(labels_pie)
    ws.add_chart(pc, "A32")

    # Chart 4: Store Comparison (horizontal bar)
    sc = BarChart()
    sc.type = "bar"
    sc.grouping = "clustered"
    sc.title = "Spending by Store"
    sc.style = 10
    sc.height = 14
    sc.width = 22
    sc.x_axis.title = "CHF"
    data_store = Reference(ws, min_col=20, min_row=2, max_row=10)
    cats_store = Reference(ws, min_col=19, min_row=3, max_row=10)
    sc.add_data(data_store, titles_from_data=True)
    sc.set_categories(cats_store)
    ws.add_chart(sc, "M32")

    ws.sheet_view.zoomScale = 90


def add_named_ranges(wb):
    ranges = {
        "ExpenseData":    "'Daily Expenses'!$A$2:$I$201",
        "ExpenseDates":   "'Daily Expenses'!$A$2:$A$201",
        "ExpenseAmounts": "'Daily Expenses'!$G$2:$G$201",
        "ExpenseCategories": "'Daily Expenses'!$C$2:$C$201",
        "MonthlyTotals":  "'Monthly Summary'!$B$3:$B$14",
        "CategoryTotals": "'Category Analysis'!$B$3:$B$17",
    }
    for name, ref in ranges.items():
        try:
            defn = DefinedName(name, attr_text=ref)
            wb.defined_names.add(defn)
        except Exception:
            pass


def create_workbook():
    wb = Workbook()
    if "Sheet" in wb.sheetnames:
        del wb["Sheet"]
    return wb


def add_all_sheets(wb):
    SHEET_DEFS = [
        ("Dashboard",           DARK_BLUE),
        ("Daily Expenses",      EMERALD),
        ("Monthly Summary",     LIGHT_BLUE),
        ("Category Analysis",   ORANGE),
        ("Budget Tracking",     RED_ALERT),
        ("Charts & Analytics",  "9B59B6"),
    ]
    sheets = {}
    for name, color in SHEET_DEFS:
        ws = wb.create_sheet(name)
        ws.sheet_properties.tabColor = color
        sheets[name] = ws
    return sheets


def main():
    print("Building Smart Personal Expense Tracker XL...")

    wb = create_workbook()
    sheets = add_all_sheets(wb)

    ws_daily   = sheets["Daily Expenses"]
    ws_monthly = sheets["Monthly Summary"]
    ws_cat     = sheets["Category Analysis"]
    ws_budget  = sheets["Budget Tracking"]
    ws_charts  = sheets["Charts & Analytics"]
    ws_dash    = sheets["Dashboard"]

    print("  Building Daily Expenses...")
    build_daily_expenses(ws_daily)

    print("  Building Monthly Summary...")
    build_monthly_summary(ws_monthly)

    print("  Building Category Analysis...")
    build_category_analysis(ws_cat)

    print("  Building Budget Tracking...")
    build_budget_tracking(ws_budget)

    print("  Building Dashboard...")
    build_dashboard(ws_dash, ws_monthly, ws_cat)

    print("  Building Charts & Analytics...")
    build_charts_analytics(ws_charts, ws_monthly, ws_cat)

    print("  Adding named ranges...")
    add_named_ranges(wb)

    wb.active = ws_dash

    output_path = "expense_tracker.xlsx"
    wb.save(output_path)
    print(f"\nDone! Saved to: {output_path}")
    print(f"Sheets: {wb.sheetnames}")


if __name__ == "__main__":
    main()
