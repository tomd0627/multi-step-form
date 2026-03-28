import { ArrowLeft, Send, Pencil, User, Briefcase, Settings } from 'lucide-react';
import type { StepProps } from '../../types/form.types';
import { Button } from '../ui/Button';
import styles from './Step.module.css';

const DEPT_LABELS: Record<string, string> = {
  engineering: 'Engineering',
  design: 'Design',
  product: 'Product',
  marketing: 'Marketing',
  sales: 'Sales',
  hr: 'Human Resources',
  finance: 'Finance',
  other: 'Other',
};

const THEME_LABELS: Record<string, string> = {
  system: 'System default',
  light: 'Light',
  dark: 'Dark',
};

interface ReviewSectionProps {
  title: string;
  icon: React.ReactNode;
  stepIndex: number;
  onEditFromReview?: (index: number) => void;
  children: React.ReactNode;
}

function ReviewSection({ title, icon, stepIndex, onEditFromReview, children }: ReviewSectionProps) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewCardHeader}>
        <h3 className={styles.reviewCardTitle}>
          <span aria-hidden="true">{icon}</span>
          {title}
        </h3>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => onEditFromReview?.(stepIndex)}
          aria-label={`Edit ${title}`}
        >
          <Pencil size={12} aria-hidden="true" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export function ReviewConfirm({ onNext, onBack, onEditFromReview, headingRef, savedData }: StepProps) {
  const notifList = [
    savedData.notifications?.email ? 'Email' : null,
    savedData.notifications?.sms ? 'SMS' : null,
    savedData.notifications?.inApp ? 'In-app' : null,
  ]
    .filter(Boolean)
    .join(', ');

  const handleSubmit = () => {
    onNext({});
  };

  return (
    <section aria-labelledby="step-heading" className={styles.step}>
      <header className={styles.stepHeader}>
        <div className={styles.stepIcon} aria-hidden="true">
          <Send size={22} strokeWidth={1.5} />
        </div>
        <div>
          <h2
            id="step-heading"
            ref={headingRef}
            tabIndex={-1}
            className={styles.stepTitle}
          >
            Review &amp; Confirm
          </h2>
          <p className={styles.stepSubtitle}>
            Double-check your information before submitting.
          </p>
        </div>
      </header>

      <div className={styles.reviewSection}>
        <ReviewSection
          title="Account"
          icon={<User size={14} />}
          stepIndex={0}
          onEditFromReview={onEditFromReview ?? (() => {})}
        >
          <dl className={styles.reviewDl}>
            <dt className={styles.reviewDt}>Name</dt>
            <dd className={styles.reviewDd}>{savedData.fullName}</dd>

            <dt className={styles.reviewDt}>Email</dt>
            <dd className={styles.reviewDd}>{savedData.email}</dd>

            <dt className={styles.reviewDt}>Password</dt>
            <dd className={styles.reviewDd}>••••••••</dd>
          </dl>
        </ReviewSection>

        <ReviewSection
          title="Role"
          icon={<Briefcase size={14} />}
          stepIndex={1}
          onEditFromReview={onEditFromReview ?? (() => {})}
        >
          <dl className={styles.reviewDl}>
            <dt className={styles.reviewDt}>Title</dt>
            <dd className={styles.reviewDd}>{savedData.jobTitle}</dd>

            <dt className={styles.reviewDt}>Dept</dt>
            <dd className={styles.reviewDd}>
              {savedData.department ? DEPT_LABELS[savedData.department] : '—'}
            </dd>

            <dt className={styles.reviewDt}>Size</dt>
            <dd className={styles.reviewDd}>
              {savedData.companySize ? `${savedData.companySize} employees` : '—'}
            </dd>
          </dl>
        </ReviewSection>

        <ReviewSection
          title="Preferences"
          icon={<Settings size={14} />}
          stepIndex={2}
          onEditFromReview={onEditFromReview ?? (() => {})}
        >
          <dl className={styles.reviewDl}>
            <dt className={styles.reviewDt}>Alerts</dt>
            <dd className={styles.reviewDd}>{notifList || 'None'}</dd>

            <dt className={styles.reviewDt}>Theme</dt>
            <dd className={styles.reviewDd}>
              {savedData.theme ? THEME_LABELS[savedData.theme] : '—'}
            </dd>

            <dt className={styles.reviewDt}>Timezone</dt>
            <dd className={styles.reviewDd}>
              {savedData.timezone?.replace(/_/g, ' ') ?? '—'}
            </dd>
          </dl>
        </ReviewSection>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          icon={<ArrowLeft size={18} />}
          iconPosition="left"
        >
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} icon={<Send size={18} />}>
          Submit
        </Button>
      </div>
    </section>
  );
}
