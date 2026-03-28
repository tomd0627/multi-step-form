import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, RotateCcw, Settings, AlertCircle } from 'lucide-react';
import { preferencesSchema } from '../../schemas/formSchema';
import type { PreferencesData, StepProps } from '../../types/form.types';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import styles from './Step.module.css';

const TIMEZONES = [
  { group: 'Americas', options: [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'America/Toronto',
    'America/Vancouver',
    'America/Sao_Paulo',
  ]},
  { group: 'Europe', options: [
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Stockholm',
    'Europe/Warsaw',
  ]},
  { group: 'Asia & Pacific', options: [
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Seoul',
    'Australia/Sydney',
    'Pacific/Auckland',
  ]},
];

const THEME_OPTIONS = [
  { value: 'system', label: 'System default', sub: 'Matches your OS setting' },
  { value: 'light', label: 'Light', sub: 'Always light mode' },
  { value: 'dark', label: 'Dark', sub: 'Always dark mode' },
] as const;

const NOTIFICATION_OPTIONS = [
  { key: 'email' as const, label: 'Email notifications', sub: 'Updates, digests, and alerts via email' },
  { key: 'sms' as const, label: 'SMS notifications', sub: 'Critical alerts sent to your phone' },
  { key: 'inApp' as const, label: 'In-app notifications', sub: 'Notifications within the platform' },
];

export function Preferences({ onNext, onBack, headingRef, savedData, returnToReview }: StepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PreferencesData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: savedData.notifications ?? { email: true, sms: false, inApp: true },
      theme: savedData.theme ?? 'system',
      timezone: savedData.timezone ?? '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: PreferencesData) => {
    onNext(data);
  };

  return (
    <section aria-labelledby="step-heading" className={styles.step}>
      <header className={styles.stepHeader}>
        <div className={styles.stepIcon} aria-hidden="true">
          <Settings size={22} strokeWidth={1.5} />
        </div>
        <div>
          <h2
            id="step-heading"
            ref={headingRef}
            tabIndex={-1}
            className={styles.stepTitle}
          >
            Preferences
          </h2>
          <p className={styles.stepSubtitle}>
            Customize how you receive updates and interact with the platform.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        {/* Notifications — fieldset/legend for grouped checkboxes */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Notifications</legend>
          <div className={styles.radioGroup}>
            {NOTIFICATION_OPTIONS.map(({ key, label, sub }) => (
              <label key={key} className={styles.checkboxLabel}>
                <Controller
                  name={`notifications.${key}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
                <span className={styles.radioLabelText}>
                  {label}
                  <span className={styles.radioLabelSub}>{sub}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Theme — radio group */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Appearance</legend>
          <div
            className={styles.radioGroup}
            role="group"
            aria-describedby={errors.theme ? 'theme-error' : undefined}
          >
            {THEME_OPTIONS.map(({ value, label, sub }) => (
              <label key={value} className={styles.radioLabel}>
                <input
                  type="radio"
                  value={value}
                  {...register('theme')}
                />
                <span className={styles.radioLabelText}>
                  {label}
                  <span className={styles.radioLabelSub}>{sub}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.theme && (
            <span id="theme-error" role="alert" className={styles.fieldError}>
              <AlertCircle size={14} aria-hidden="true" />
              {errors.theme.message}
            </span>
          )}
        </fieldset>

        {/* Timezone select */}
        <FormField
          id="timezone"
          as="select"
          label="Timezone"
          required
          error={errors.timezone?.message}
          selectProps={register('timezone')}
        >
          <option value="">Select your timezone…</option>
          {TIMEZONES.map(({ group, options }) => (
            <optgroup key={group} label={group}>
              {options.map(tz => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </optgroup>
          ))}
        </FormField>

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
            {returnToReview ? 'Save & Return to Review' : 'Review'}
          </Button>
        </div>
      </form>
    </section>
  );
}
