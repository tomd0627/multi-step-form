import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, Zap, Shield, Bell } from 'lucide-react';
import type { RefObject } from 'react';
import { Button } from '../ui/Button';
import styles from './Step.module.css';

interface SuccessStateProps {
  onReset: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  name?: string;
}

export function SuccessState({ onReset, headingRef, name }: SuccessStateProps) {
  return (
    <div className={styles.successStep}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={styles.successIcon}
        aria-hidden="true"
      >
        <CheckCircle size={36} strokeWidth={1.5} />
      </motion.div>

      <div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className={styles.successTitle}
          id="success-heading"
        >
          You&apos;re all set{name ? `, ${name.split(' ')[0]}` : ''}!
        </h2>
        <p className={styles.successSubtitle}>
          Your account has been configured. Welcome aboard.
        </p>
      </div>

      <section className={styles.successMeta} aria-label="What happens next">
        <div className={styles.successMetaRow}>
          <Zap size={16} className={styles.successMetaIcon} aria-hidden="true" />
          <span>Your workspace is being set up</span>
        </div>
        <div className={styles.successMetaRow}>
          <Bell size={16} className={styles.successMetaIcon} aria-hidden="true" />
          <span>A confirmation email is on its way</span>
        </div>
        <div className={styles.successMetaRow}>
          <Shield size={16} className={styles.successMetaIcon} aria-hidden="true" />
          <span>Your preferences have been saved</span>
        </div>
      </section>

      <Button
        type="button"
        variant="ghost"
        onClick={onReset}
        icon={<RotateCcw size={16} />}
        iconPosition="left"
      >
        Start over
      </Button>
    </div>
  );
}
