import React, { useState, useEffect } from 'react';

const useDebouncedRippleCleanUp = (rippleCount, duration, cleanUpFunction) => {
    useEffect(() => {
        let bounce = null;
        if (rippleCount > 0) {
            clearTimeout(bounce);

            bounce = setTimeout(() => {
                cleanUpFunction();
                clearTimeout(bounce);
            }, duration * 4);
        }

        return () => clearTimeout(bounce);
    }, [rippleCount, duration, cleanUpFunction]);
};


const Ripple = ({ duration = 850, color = 'bg-white' }) => {
  const [rippleArray, setRippleArray] = useState([]);

  useDebouncedRippleCleanUp(rippleArray.length, duration, () => {
    setRippleArray([]);
  });

  const addRipple = event => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;
    const x = event.pageX - rippleContainer.x - size / 2;
    const y = event.pageY - rippleContainer.y - size / 2;
    const newRipple = {
      x,
      y,
      size
    };

    setRippleArray([...rippleArray, newRipple]);
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0" onMouseDown={addRipple}>
      {rippleArray.length > 0 &&
        rippleArray.map((ripple, index) => {
          return (
            <span
              key={'span' + index}
              className={`absolute rounded-full animate-ripple ${color}`}
              style={{
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
                animationDuration: `${duration}ms`
              }}
            />
          );
        })}
    </div>
  );
};

export default Ripple;
