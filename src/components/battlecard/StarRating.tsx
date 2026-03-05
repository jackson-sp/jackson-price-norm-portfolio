import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

export function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';
  return (
    <div className="flex gap-0.5" role="group" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`${sizeClass} p-0.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-norm-500 focus:ring-offset-1`}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`${sizeClass} ${
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
