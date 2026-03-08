import React from 'react';

interface LoadingProps {
  size?: 'sm';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size,
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const spinner = (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <span
        className={`loading loading-spinner ${size === 'sm' ? 'loading-sm' : 'loading-md'} text-primary`}
        aria-hidden
      />
      {text && <span className="text-base-content/70 text-sm">{text}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        {spinner}
      </div>
    );
  }
  return spinner;
};

export default Loading;
