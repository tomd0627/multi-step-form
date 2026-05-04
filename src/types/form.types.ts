import type { z } from 'zod';
import type {
  accountSetupSchema,
  yourRoleSchema,
  preferencesSchema,
  fullFormSchema,
} from '../schemas/formSchema';
import type { RefObject } from 'react';

// Inferred from Zod — single source of truth
export type AccountSetupData = z.infer<typeof accountSetupSchema>;
export type YourRoleData = z.infer<typeof yourRoleSchema>;
export type PreferencesData = z.infer<typeof preferencesSchema>;
export type FormData = z.infer<typeof fullFormSchema>;

// Partial accumulator — each step writes its slice
export type PartialFormData = Partial<FormData>;

// Step metadata driving ProgressBar and aria-live announcements
export interface StepMeta {
  id: number;
  title: string;
  description: string;
}

// Discriminated union for slide direction
export type StepDirection = 'forward' | 'backward';

// Passed down to each step component
export interface StepProps {
  onNext: (data: PartialFormData) => void;
  onBack?: () => void;
  onGoToStep?: (index: number) => void;
  onEditFromReview?: (index: number) => void;
  stepNumber: number;
  headingRef: RefObject<HTMLHeadingElement | null>;
  savedData: PartialFormData;
  returnToReview?: boolean;
}
