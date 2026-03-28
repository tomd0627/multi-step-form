import { motion, useReducedMotion } from 'framer-motion';
import styles from './ProgressBar.module.css';

const TOTAL_STEPS = 4;

interface ProgressBarProps {
  currentStep: number;
  steps: readonly string[];
  onStepClick: (index: number) => void;
}

export function ProgressBar({ currentStep, steps, onStepClick }: ProgressBarProps) {
  const prefersReduced = useReducedMotion();
  const percentage = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className={styles.wrapper}>
      {/* Accessible progressbar track */}
      <div
        role="progressbar"
        aria-label="Form completion progress"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuetext={`Step ${currentStep + 1} of ${TOTAL_STEPS}: ${steps[currentStep] ?? ''}`}
        className={styles.track}
      >
        <motion.div
          className={styles.fill}
          animate={{ width: `${percentage}%` }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
          }
        />
      </div>

      {/* Step list — completed steps are navigable buttons */}
      <ol className={styles.stepList}>
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <li key={step} className={styles.stepItem}>
              {isCompleted ? (
                <button
                  type="button"
                  className={[styles.stepButton, styles.completed].join(' ')}
                  onClick={() => onStepClick(i)}
                  aria-label={`Go back to step ${i + 1}: ${step}`}
                >
                  <span className={styles.stepDot} aria-hidden="true">✓</span>
                  <span className={styles.stepLabel}>{step}</span>
                </button>
              ) : (
                <span
                  className={[
                    styles.stepButton,
                    isActive ? styles.active : styles.upcoming,
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className={styles.stepDot} aria-hidden="true">{i + 1}</span>
                  <span className={styles.stepLabel}>{step}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
