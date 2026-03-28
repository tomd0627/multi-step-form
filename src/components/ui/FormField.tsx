import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './FormField.module.css';

interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  as?: 'input';
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  selectProps?: never;
  children?: never;
}

interface SelectFieldProps extends BaseFieldProps {
  as: 'select';
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
  inputProps?: never;
  children: ReactNode;
}

interface CustomFieldProps extends BaseFieldProps {
  as: 'custom';
  children: ReactNode;
  inputProps?: never;
  selectProps?: never;
}

type FormFieldProps = InputFieldProps | SelectFieldProps | CustomFieldProps;

export function FormField({
  id,
  label,
  error,
  hint,
  required,
  as = 'input',
  inputProps,
  selectProps,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`${styles.field} ${error ? styles.fieldHasError : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>

      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}

      {as === 'input' && (
        <input
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          aria-required={required}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...inputProps}
        />
      )}

      {as === 'select' && (
        <div className={styles.selectWrapper}>
          <select
            id={id}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-required={required}
            className={`${styles.select} ${error ? styles.inputError : ''}`}
            {...selectProps}
          >
            {children}
          </select>
          <span className={styles.selectChevron} aria-hidden="true">
            ▾
          </span>
        </div>
      )}

      {as === 'custom' && children}

      {error && (
        <span id={errorId} role="alert" className={styles.error}>
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}
