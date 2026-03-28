import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, RotateCcw, User } from 'lucide-react';
import { accountSetupSchema } from '../../schemas/formSchema';
import type { AccountSetupData, StepProps } from '../../types/form.types';
import { FormField } from '../ui/FormField';
import { PasswordStrength } from '../ui/PasswordStrength';
import { Button } from '../ui/Button';
import styles from './Step.module.css';

export function AccountSetup({ onNext, headingRef, savedData, returnToReview }: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountSetupData>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      fullName: savedData.fullName ?? '',
      email: savedData.email ?? '',
      password: savedData.password ?? '',
    },
    mode: 'onBlur',
  });

  const password = watch('password', '');

  const onSubmit = (data: AccountSetupData) => {
    onNext(data);
  };

  return (
    <section aria-labelledby="step-heading" className={styles.step}>
      <header className={styles.stepHeader}>
        <div className={styles.stepIcon} aria-hidden="true">
          <User size={22} strokeWidth={1.5} />
        </div>
        <div>
          <h2
            id="step-heading"
            ref={headingRef}
            tabIndex={-1}
            className={styles.stepTitle}
          >
            Account Setup
          </h2>
          <p className={styles.stepSubtitle}>
            Start with your basic account information.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        <FormField
          id="fullName"
          label="Full name"
          required
          error={errors.fullName?.message}
          inputProps={{
            ...register('fullName'),
            type: 'text',
            placeholder: 'Jane Smith',
            autoComplete: 'name',
          }}
        />

        <FormField
          id="email"
          label="Email address"
          required
          error={errors.email?.message}
          inputProps={{
            ...register('email'),
            type: 'email',
            placeholder: 'jane@example.com',
            autoComplete: 'email',
          }}
        />

        <div className={styles.passwordGroup}>
          <FormField
            id="password"
            label="Password"
            required
            error={errors.password?.message}
            hint="Min 8 characters with uppercase, number, and symbol"
            inputProps={{
              ...register('password'),
              type: 'password',
              placeholder: '••••••••',
              autoComplete: 'new-password',
            }}
          />
          <PasswordStrength password={password} />
        </div>

        <div className={styles.actions}>
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
