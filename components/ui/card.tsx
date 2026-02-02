import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from './text';

interface CardProps extends ViewProps {
  className?: string;
}

const Card = React.forwardRef<View, CardProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('rounded-lg border border-border bg-card p-4', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, CardProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('pb-2', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends CardProps {
  children?: React.ReactNode;
}

const CardTitle = React.forwardRef<View, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <Text className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </Text>
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<View, CardProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
export type { CardProps, CardTitleProps };
