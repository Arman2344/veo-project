import { useI18n } from '../i18n/I18nContext';

export default function TrustSection() {
  const { t } = useI18n();

  const items = [
    { icon: '🔒', title: t('trust.securePayment'), desc: t('trust.securePaymentDesc') },
    { icon: '⚡', title: t('trust.instantDelivery'), desc: t('trust.instantDeliveryDesc') },
    { icon: '🤝', title: t('trust.moneyBack'), desc: t('trust.moneyBackDesc') },
  ];

  return (
    <section className="section section-alt">
      <div className="container">
        <h2 className="text-center">{t('trust.title')}</h2>
        <div className="trust-grid">
          {items.map((item) => (
            <div key={item.title} className="card">
              <div className="trust-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p className="text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
