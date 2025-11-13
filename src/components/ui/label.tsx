import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className = '', ...props }, ref) => {
    const styles = `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`;
    
    return <LabelPrimitive.Root ref={ref} className={styles} {...props} />;
  }
);
