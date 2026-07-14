/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const [logoError, setLogoError] = useState(false);

  // Responsive dimension classes
  const dimensions = {
    sm: 'h-8 text-sm gap-2',
    md: 'h-12 text-lg gap-3',
    lg: 'h-20 text-2xl gap-4',
  };

  const iconSizes = {
    sm: 18,
    md: 28,
    lg: 44,
  };

  return (
    <div className={`flex items-center justify-center font-display ${dimensions[size]} ${className}`}>
      {!logoError ? (
        <img
          src="/logo.png"
          alt="Instant 3D Logo"
          className="h-full object-contain max-w-[200px]"
          onError={() => setLogoError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        // Highly crafted vector fallback if logo.png does not exist
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20">
            <Layers size={iconSizes[size]} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-extrabold tracking-wider text-slate-900">
              INSTANT <span className="text-emerald-500">3D</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-slate-500 mt-0.5">
              Triple Dimension
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
