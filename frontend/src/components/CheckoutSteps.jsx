import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { number: 1, title: 'Sign In', link: '/login', active: step1 },
    { number: 2, title: 'Shipping', link: '/shipping', active: step2 },
    { number: 3, title: 'Payment', link: '/payment', active: step3 },
    { number: 4, title: 'Place Order', link: '/placeorder', active: step4 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
        margin: '1.5rem auto 2.5rem auto',
        maxWidth: '700px',
        flexWrap: 'wrap',
      }}
    >
      {steps.map((step, index) => {
        const isCurrent = step.active && (!steps[index + 1] || !steps[index + 1].active);

        return (
          <React.Fragment key={step.number}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {step.active ? (
                <Link
                  to={step.link}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: isCurrent ? 'var(--primary-color)' : '#166534',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? 'var(--primary-color)' : '#dcfce7',
                      color: isCurrent ? '#ffffff' : '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                    }}
                  >
                    {!isCurrent && step.active ? <Check size={14} /> : step.number}
                  </span>
                  <span>{step.title}</span>
                </Link>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    opacity: 0.6,
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {step.number}
                  </span>
                  <span>{step.title}</span>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <span
                style={{
                  height: '2px',
                  width: '30px',
                  backgroundColor: step.active ? '#86efac' : 'var(--border-color)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
