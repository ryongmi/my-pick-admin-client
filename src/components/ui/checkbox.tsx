'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  id,
}: CheckboxProps): JSX.Element {
  const handleChange = (): void => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleChange}
      disabled={disabled}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked
          ? 'bg-primary text-primary-foreground'
          : 'bg-background hover:bg-accent',
        className
      )}
    >
      {checked ? <Check className="h-3 w-3 text-current" /> : null}
    </button>
  );
}