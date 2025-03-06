'use client';

import Image from 'next/image';
import { theme } from '@/lib/theme';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 96, height: 96 },
};

export default function Logo({ showText = true, size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={sizes[size]}>
        <Image
          src={theme.company.logo}
          alt={theme.company.name}
          width={sizes[size].width}
          height={sizes[size].height}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="text-center mt-2">
          <h1 className="font-bold text-current">
            {theme.company.name}
          </h1>
          <p className="text-sm italic text-current opacity-80">
            {theme.company.slogan}
          </p>
        </div>
      )}
    </div>
  );
} 