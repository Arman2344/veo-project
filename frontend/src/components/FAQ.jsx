import { useState } from 'react';

export default function FAQ({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="faq-list">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div className="faq-item" key={idx}>
            <button
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="faq-answer">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
