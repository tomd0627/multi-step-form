import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Briefcase, AlertCircle, RotateCcw } from 'lucide-react';
import { yourRoleSchema } from '../../schemas/formSchema';
import type { YourRoleData, StepProps } from '../../types/form.types';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import styles from './Step.module.css';

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
] as const;

const COMPANY_SIZES = [
  { value: '1–10', label: '1–10', sub: 'Startup' },
  { value: '11–50', label: '11–50', sub: 'Small' },
  { value: '51–200', label: '51–200', sub: 'Mid-size' },
  { value: '201–1,000', label: '201–1,000', sub: 'Growth' },
  { value: '1,001+', label: '1,001+', sub: 'Enterprise' },
] as const;

export function YourRole({ onNext, onBack, headingRef, savedData, returnToReview }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<YourRoleData>({
    resolver: zodResolver(yourRoleSchema),
    defaultValues: {
      jobTitle: savedData.jobTitle ?? '',
      department: savedData.department,
      companySize: savedData.companySize,
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: YourRoleData) => {
    onNext(data);
  };

  return (
    <section aria-labelledby="step-heading" className={styles.step}>
      <header className={styles.stepHeader}>
        <div className={styles.stepIcon} aria-hidden="true">
          <Briefcase size={22} strokeWidth={1.5} />
        </div>
        <div>
          <h2
            id="step-heading"
            ref={headingRef}
            tabIndex={-1}
            className={styles.stepTitle}
          >
            Your Role
          </h2>
          <p className={styles.stepSubtitle}>
            Help us tailor your experience to your work context.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        <FormField
          id="jobTitle"
          label="Job title"
          required
          error={errors.jobTitle?.message}
          inputProps={{
            ...register('jobTitle'),
            type: 'text',
            placeholder: 'e.g. Senior Product Designer',
            autoComplete: 'organization-title',
          }}
        />

        <FormField
          id="department"
          as="select"
          label="Department"
          required
          error={errors.department?.message}
          selectProps={register('department')}
        >
          <option value="">Select a department…</option>
          {DEPARTMENTS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>

        {/* Company size radio group — fieldset/legend for WCAG 1.3.1 */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Company size</legend>
          <div className={styles.radioGroup} role="group">
            {COMPANY_SIZES.map(({ value, label, sub }) => (
              <label key={value} className={styles.radioLabel}>
                <input
                  type="radio"
                  value={value}
                  aria-describedby={errors.companySize ? 'companySize-error' : undefined}
                  {...register('companySize')}
                />
                <span className={styles.radioLabelText}>
                  {label} employees
                  <span className={styles.radioLabelSub}>{sub}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.companySize && (
            <span id="companySize-error" role="alert" className={styles.fieldError}>
              <AlertCircle size={14} aria-hidden="true" />
              {errors.companySize.message}
            </span>
          )}
        </fieldset>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            icon={<ArrowLeft size={18} />}
            iconPosition="left"
          >
            {returnToReview ? 'Cancel' : 'Back'}
          </Button>
          <Button
            type="submit"
            icon={returnToReview ? <RotateCcw size={16} /> : <ArrowRight size={18} />}
          >
            {returnToReview ? 'Save & Return to Review' : 'Continue'}
          </Button>
        </div>
      </form>
    </section>
  );
}
