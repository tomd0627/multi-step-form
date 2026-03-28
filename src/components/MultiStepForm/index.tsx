import { useRef, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useFormStep } from '../../hooks/useFormStep';
import { useTheme } from '../../hooks/useTheme';
import { ProgressBar } from '../ui/ProgressBar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { AccountSetup } from '../steps/AccountSetup';
import { YourRole } from '../steps/YourRole';
import { Preferences } from '../steps/Preferences';
import { ReviewConfirm } from '../steps/ReviewConfirm';
import { SuccessState } from '../steps/SuccessState';
import { stepVariants } from './variants';
import type { StepMeta, PartialFormData } from '../../types/form.types';
import styles from './MultiStepForm.module.css';

const STEPS: StepMeta[] = [
  { id: 0, title: 'Account',    description: 'Step 1 of 4: Account Setup'       },
  { id: 1, title: 'Role',       description: 'Step 2 of 4: Your Role'            },
  { id: 2, title: 'Prefs',      description: 'Step 3 of 4: Preferences'          },
  { id: 3, title: 'Review',     description: 'Step 4 of 4: Review and Confirm'   },
];

const STEP_LABELS = STEPS.map(s => s.title);

export function MultiStepForm() {
  const {
    currentStep,
    direction,
    formData,
    isComplete,
    returnToReview,
    goNext,
    goBack,
    goToStep,
    editFromReview,
    reset,
  } = useFormStep();
  const { theme, toggle } = useTheme();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // On every step change: move focus to the heading AND announce via aria-live.
  // Both currentStep and isComplete are used in the body, satisfying exhaustive-deps.
  useEffect(() => {
    const announcement = isComplete
      ? 'Form complete. Account setup was successful.'
      : (STEPS[currentStep]?.description ?? '');

    const focusId = setTimeout(() => headingRef.current?.focus(), 50);
    const announceId = setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = announcement;
    }, 100);

    return () => {
      clearTimeout(focusId);
      clearTimeout(announceId);
    };
  }, [currentStep, isComplete]);

  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] };

  const stepProps = {
    headingRef,
    savedData: formData as PartialFormData,
    onNext: (data: PartialFormData) => goNext(data),
    onBack: goBack,
    onGoToStep: goToStep,
    onEditFromReview: editFromReview,
    stepNumber: currentStep,
    returnToReview,
  };

  return (
    <div className={styles.wrapper}>
      {/* Visually-hidden aria-live region — separate from animation container */}
      <div
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className={styles.liveRegion}
      />

      {/* motion.div with layout animates the card's height whenever step content changes */}
      <motion.div className={styles.card} layout="size" transition={transition}>
        {/* Header */}
        <header className={styles.cardHeader}>
          <div className={styles.cardHeaderTop}>
            <h1 className={styles.brand}>Onboarding</h1>
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
          {!isComplete && (
            <ProgressBar
              currentStep={currentStep}
              steps={STEP_LABELS}
              onStepClick={goToStep}
            />
          )}
        </header>

        {/*
          popLayout: exiting step is absolutely positioned by Framer Motion and removed from
          flow immediately, so the container sizes to the incoming step with no empty-gap pause.
          The card's layout animation then smoothly animates the height change.
        */}
        <div className={styles.stepContainer}>
          <AnimatePresence mode="popLayout" custom={direction}>
            {isComplete ? (
              <motion.div
                key="success"
                variants={stepVariants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className={styles.stepPanel}
              >
                <SuccessState
                  onReset={reset}
                  headingRef={headingRef}
                  name={formData.fullName}
                />
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                variants={stepVariants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className={styles.stepPanel}
              >
                {currentStep === 0 && <AccountSetup {...stepProps} />}
                {currentStep === 1 && <YourRole {...stepProps} />}
                {currentStep === 2 && <Preferences {...stepProps} />}
                {currentStep === 3 && <ReviewConfirm {...stepProps} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
