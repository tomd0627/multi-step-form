import type { Variants } from 'framer-motion';
import type { StepDirection } from '../../types/form.types';

// Defined outside the component to prevent recreation on each render.
// Uses Framer Motion's `custom` prop to receive direction at animation time.
export const stepVariants: Variants = {
  enter: (direction: StepDirection) => ({
    x: direction === 'forward' ? '60%' : '-60%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: StepDirection) => ({
    x: direction === 'forward' ? '-60%' : '60%',
    opacity: 0,
  }),
};
