import React, { useState } from 'react';

interface AvatarProps {
  id: string;
  src?: string;
  description?: string;
  fallbackText: string;
  fallbackColor: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ id, src, description, fallbackText, fallbackColor, className }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
        className={`relative overflow-hidden flex items-center justify-center shadow-md ${className}`}
        style={{ backgroundColor: (!src || hasError) ? fallbackColor : 'transparent' }}
    >
      {src && !hasError ? (
        <img 
          src={src} 
          alt={description || "Avatar"} 
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-white font-bold opacity-80">{fallbackText}</span>
      )}
    </div>
  );
};