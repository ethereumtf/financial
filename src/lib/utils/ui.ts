// Re-export UI components to ensure they're available
export * from '@/components/ui/button';
export * from '@/components/ui/input';
export * from '@/components/ui/select';
export * from '@/components/ui/tabs';

// Add any additional UI utility functions here
export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
