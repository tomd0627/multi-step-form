import styles from './PasswordStrength.module.css';

interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function getStrength(password: string): StrengthResult {
  if (password.length === 0) {
    return { score: 0, label: '', color: '' };
  }
  if (password.length < 8) {
    return { score: 0, label: 'Too short', color: 'var(--color-strength-weak)' };
  }

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'var(--color-strength-weak)',
    'var(--color-strength-weak)',
    'var(--color-strength-fair)',
    'var(--color-strength-good)',
    'var(--color-strength-strong)',
  ];

  return {
    score: score as StrengthResult['score'],
    label: labels[score] ?? 'Unknown',
    color: colors[score] ?? '',
  };
}

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getStrength(password);

  if (password.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.segments} role="presentation" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={styles.segment}
            style={{ backgroundColor: i < score ? color : undefined }}
          />
        ))}
      </div>
      <span className={styles.label} aria-live="polite" aria-atomic="true">
        {label && (
          <>
            <span className={styles.dot} style={{ backgroundColor: color }} aria-hidden="true" />
            {label}
          </>
        )}
      </span>
    </div>
  );
}
