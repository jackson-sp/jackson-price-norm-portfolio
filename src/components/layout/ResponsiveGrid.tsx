import type { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

/** Same responsive grid as portfolio cards: 1 col mobile, 2 medium, 3 desktop. Same gap. */
export default function ResponsiveGrid({ children, className = '' }: ResponsiveGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
