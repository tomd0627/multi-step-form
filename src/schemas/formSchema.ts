import { z } from 'zod';

export const accountSetupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must be 80 characters or fewer')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name may only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
});

export const yourRoleSchema = z.object({
  jobTitle: z
    .string()
    .min(2, 'Job title is required')
    .max(100, 'Job title must be 100 characters or fewer'),
  department: z.enum(
    ['engineering', 'design', 'product', 'marketing', 'sales', 'hr', 'finance', 'other'],
    { message: 'Please select a department' },
  ),
  companySize: z.enum(['1–10', '11–50', '51–200', '201–1,000', '1,001+'], {
    message: 'Please select your company size',
  }),
});

export const preferencesSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    inApp: z.boolean(),
  }),
  theme: z.enum(['system', 'light', 'dark']),
  timezone: z.string().min(1, 'Please select a timezone'),
});

// Merged schema — used only for final type inference and ReviewConfirm display
export const fullFormSchema = accountSetupSchema
  .merge(yourRoleSchema)
  .merge(preferencesSchema);
