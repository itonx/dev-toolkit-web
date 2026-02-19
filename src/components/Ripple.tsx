import React, { useState, useEffect, useRef } from 'react';

interface RippleItem {
  key: number;
  x: number;
  y: number;
}

const Ripple: React.FC = () => {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = ref.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newRipple = { key: Date.now(), x, y };
        setRipples(prev => [...prev, newRipple]);
      }
    };

    const target = ref.current?.parentElement;
    if (target) {
      target.addEventListener('click', handleClick);
    }

    return () => {
      if (target) {
        target.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {ripples.map(ripple => (
        <span
          key={ripple.key}
          className="absolute bg-white opacity-25 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            animation: 'ripple-effect 1s linear',
          }}
          onAnimationEnd={() => setRipples(prev => prev.filter(r => r.key !== ripple.key))}
        />
      ))}
    </div>
  );
};

export default Ripple;
