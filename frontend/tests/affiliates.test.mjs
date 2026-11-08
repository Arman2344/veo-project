import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import affiliates from '../src/data/affiliates.json' with { type: 'json' };
import fa from '../src/i18n/fa.json' with { type: 'json' };
import de from '../src/i18n/de.json' with { type: 'json' };
import { getToolLink, isUsableExternalUrl, publicAssetUrl } from '../src/lib/affiliateLinks.js';

const translations = {
  'affiliates.officialCta': 'Official site',
  'affiliates.affiliateCta': 'Affiliate link',
  'affiliates.unavailableCta': 'Unavailable',
  'affiliates.officialLabel': 'Official link notice',
  'affiliates.affiliateLabel': 'Affiliate link notice',
  'affiliates.unavailableLabel': 'Unavailable link notice',
};
const t = (key) => translations[key] || key;

const tool = {
  id: 'tool',
  image: '/images/affiliates/canva.svg',
  name: { en: 'Example' },
  description: { en: 'Product information' },
  officialUrl: 'https://www.canva.com/pro/',
  affiliateUrl: null,
  affiliateVerified: false,
};

let vite;
let AffiliateCard;
let Affiliates;
let I18nProvider;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
  ({ AffiliateCard, default: Affiliates } = await vite.ssrLoadModule('/src/pages/Affiliates.jsx'));
  ({ I18nProvider } = await vite.ssrLoadModule('/src/i18n/I18nContext.jsx'));
});

after(async () => {
  await vite?.close();
});

function renderCard(overrides, lang = 'en', translate = t) {
  return renderToStaticMarkup(createElement(AffiliateCard, {
    affiliate: { ...tool, ...overrides }, lang, t: translate,
  }));
}

test('only HTTPS production URLs without placeholders are usable', () => {
  assert.equal(isUsableExternalUrl('https://www.canva.com/pro/'), true);
  for (const bad of [
    '', null, undefined, '/local', 'javascript:alert(1)', 'http://www.canva.com/',
    'https://example.com/offer', 'https://localhost/foo',
    'https://www.canva.com/REPLACE_WITH_YOUR_AFFILIATE_LINK',
    'https://kit.com/?lmref=REPLACE_WITH_YOUR_AFFILIATE_LINK',
    'https://notion.com/?ref={{YOUR_LINK}}',
    'https://user:password@www.canva.com/',
  ]) {
    assert.equal(isUsableExternalUrl(bad), false, `should reject ${bad}`);
  }
});

test('valid, owner-verified affiliate URL shows a labeled sponsored button', () => {
  const affiliateUrl = 'https://partner.fixture-vendor.dev/test-ref-123';
  const entry = { affiliateUrl, affiliateVerified: true };
  assert.deepEqual(getToolLink({ ...tool, ...entry }), { href: affiliateUrl, type: 'affiliate' });
  const html = renderCard(entry);
  assert.match(html, /href="https:\/\/partner\.fixture-vendor\.dev\/test-ref-123"/);
  assert.match(html, /rel="sponsored nofollow noopener noreferrer"/);
  assert.match(html, />Affiliate link<\/a>/);
  assert.match(html, /Affiliate link notice/);
});

test('placeholder or unverified affiliate URL falls back to the official URL', () => {
  for (const entry of [
    { affiliateUrl: 'https://partner.fixture-vendor.dev/REPLACE_WITH_YOUR_AFFILIATE_LINK', affiliateVerified: true },
    { affiliateUrl: 'https://partner.fixture-vendor.dev/test-ref-123', affiliateVerified: false },
    { affiliateUrl: null, affiliateVerified: false },
  ]) {
    assert.equal(getToolLink({ ...tool, ...entry }).type, 'official');
    const html = renderCard(entry);
    assert.match(html, /href="https:\/\/www\.canva\.com\/pro\/"/);
    assert.match(html, />Official site<\/a>/);
    assert.match(html, /Official link notice/);
    assert.doesNotMatch(html, /sponsored|test-ref-123|REPLACE_WITH/);
  }
});

test('missing or invalid destinations show a disabled button and no anchor', () => {
  for (const entry of [
    { officialUrl: null, affiliateUrl: null },
    { officialUrl: 'https://example.com/placeholder', affiliateUrl: 'javascript:alert(1)', affiliateVerified: true },
  ]) {
    assert.deepEqual(getToolLink({ ...tool, ...entry }), { href: null, type: 'unavailable' });
    const html = renderCard(entry);
    assert.match(html, /<button[^>]*disabled=""[^>]*>Unavailable<\/button>/);
    assert.match(html, /Unavailable link notice/);
    assert.doesNotMatch(html, /<a\b|href=/);
  }
});

test('Persian and German buttons clearly distinguish official and affiliate links', () => {
  for (const [lang, dictionary] of [['fa', fa], ['de', de]]) {
    const translate = (key) => key.split('.').reduce((item, part) => item?.[part], dictionary);
    const officialHtml = renderCard({}, lang, translate);
    assert.ok(officialHtml.includes(dictionary.affiliates.officialCta));
    assert.ok(officialHtml.includes(dictionary.affiliates.officialLabel));

    const affiliateHtml = renderCard({ affiliateUrl: 'https://partner.fixture-vendor.dev/test-ref', affiliateVerified: true }, lang, translate);
    assert.ok(affiliateHtml.includes(dictionary.affiliates.affiliateCta));
    assert.ok(affiliateHtml.includes(dictionary.affiliates.affiliateLabel));

    const unavailableHtml = renderCard({ officialUrl: null }, lang, translate);
    assert.ok(unavailableHtml.includes(dictionary.affiliates.unavailableCta));
  }
});

test('all current cards lead only to official product websites', () => {
  assert.equal(affiliates.length, 3);
  for (const item of affiliates) {
    assert.equal(item.affiliateVerified, false);
    assert.equal(item.affiliateUrl, null);
    assert.equal(getToolLink(item).type, 'official');
  }
  const html = renderToStaticMarkup(createElement(I18nProvider, null, createElement(Affiliates)));
  assert.equal((html.match(/target="_blank"/g) || []).length, 3);
  assert.equal((html.match(/rel="noopener noreferrer"/g) || []).length, 3);
  assert.doesNotMatch(html, /REPLACE_WITH|sponsored|Free 30-day|10,000 subscribers/);
});

test('GitHub Pages base path prefixes card images, not external buttons', () => {
  assert.equal(vite.config.base, '/veo-project/');
  assert.equal(publicAssetUrl('/images/affiliates/canva.svg', vite.config.base), '/veo-project/images/affiliates/canva.svg');
  const html = renderCard();
  assert.match(html, /src="\/veo-project\/images\/affiliates\/canva\.svg"/);
  assert.match(html, /href="https:\/\/www\.canva\.com\/pro\/"/);
  assert.doesNotMatch(html, /href="\/veo-project\/https:/);
});
