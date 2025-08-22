'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | undefined>(undefined);

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps): JSX.Element {
  const context = useContext(DropdownMenuContext);
  
  if (!context) {
    throw new Error('DropdownMenuTrigger must be used within DropdownMenu');
  }

  const { open, setOpen } = context;

  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function DropdownMenuContent({ children, align = 'start', className }: DropdownMenuContentProps): JSX.Element | null {
  const context = useContext(DropdownMenuContext);
  
  if (!context) {
    throw new Error('DropdownMenuContent must be used within DropdownMenu');
  }

  const { open, setOpen } = context;

  if (!open) {return null;}

  const alignmentClass = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  }[align];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40"
        onClick={() => setOpen(false)}
      />
      
      {/* Content */}
      <div className={cn(
        'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        alignmentClass,
        className
      )}>
        {children}
      </div>
    </>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  asChild?: boolean;
}

export function DropdownMenuItem({ children, onClick, className, asChild }: DropdownMenuItemProps): JSX.Element {
  const context = useContext(DropdownMenuContext);
  
  if (!context) {
    throw new Error('DropdownMenuItem must be used within DropdownMenu');
  }

  const { setOpen } = context;

  const handleClick = (): void => {
    onClick?.();
    setOpen(false);
  };

  const itemClassName = cn(
    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      className: cn(itemClassName, children.props.className),
      onClick: handleClick,
    });
  }

  return (
    <button
      className={itemClassName}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps): JSX.Element {
  return (
    <div className={cn('-mx-1 my-1 h-px bg-muted', className)} />
  );
}