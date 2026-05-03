import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
  innerClassName?: string;
};

const StarBorder = <T extends React.ElementType = 'div'>({
  as,
  className = '',
  innerClassName = '',
  color = '#DE638A',
  speed = '6s',
  thickness = 2,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'div';

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[24px] ${className}`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px`,
        ...(rest as any).style
      }}
    >
      <div
        className="absolute w-[300%] h-[100%] opacity-70 bottom-[-50%] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[100%] opacity-70 top-[-50%] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div className={`relative z-10 h-full w-full rounded-[22px] ${innerClassName}`}>
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
