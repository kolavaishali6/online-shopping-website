import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, text = '', color = '#f59e0b', size = 16 }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={{ display: 'inline-block', lineHeight: 1 }}>
            {value >= star ? (
              <Star size={size} fill={color} color={color} />
            ) : value >= star - 0.5 ? (
              // Half star visualization
              <span style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
                <Star size={size} color={color} style={{ position: 'absolute', top: 0, left: 0 }} />
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    overflow: 'hidden',
                    display: 'inline-block',
                  }}
                >
                  <Star size={size} fill={color} color={color} />
                </span>
              </span>
            ) : (
              <Star size={size} color="#cbd5e1" />
            )}
          </span>
        ))}
      </div>
      {text && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;
