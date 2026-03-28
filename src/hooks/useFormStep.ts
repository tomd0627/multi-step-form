import { useState, useCallback } from 'react';
import type { PartialFormData, StepDirection } from '../types/form.types';

const TOTAL_STEPS = 4;
const REVIEW_STEP = 3;

interface UseFormStepReturn {
  currentStep: number;
  direction: StepDirection;
  formData: PartialFormData;
  isComplete: boolean;
  returnToReview: boolean;
  goNext: (stepData: PartialFormData) => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  editFromReview: (index: number) => void;
  reset: () => void;
}

export function useFormStep(): UseFormStepReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<StepDirection>('forward');
  const [formData, setFormData] = useState<PartialFormData>({});
  const [isComplete, setIsComplete] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);

  const goNext = useCallback(
    (stepData: PartialFormData) => {
      setFormData(prev => ({ ...prev, ...stepData }));
      setDirection('forward');

      if (returnToReview) {
        // User was editing from the review step — send them straight back
        setReturnToReview(false);
        setCurrentStep(REVIEW_STEP);
      } else if (currentStep >= TOTAL_STEPS - 1) {
        setIsComplete(true);
      } else {
        setCurrentStep(s => s + 1);
      }
    },
    [currentStep, returnToReview],
  );

  const goBack = useCallback(() => {
    setDirection('backward');
    if (returnToReview) {
      // Cancel the edit — go back to review directly
      setReturnToReview(false);
      setCurrentStep(REVIEW_STEP);
    } else {
      setCurrentStep(s => Math.max(0, s - 1));
    }
  }, [returnToReview]);

  // Standard navigation (used by clickable progress bar steps)
  const goToStep = useCallback(
    (index: number) => {
      setDirection(index < currentStep ? 'backward' : 'forward');
      setReturnToReview(false);
      setCurrentStep(index);
    },
    [currentStep],
  );

  // Navigation from ReviewConfirm "Edit" buttons — sets returnToReview flag
  const editFromReview = useCallback(
    (index: number) => {
      setDirection('backward');
      setReturnToReview(true);
      setCurrentStep(index);
    },
    [],
  );

  const reset = useCallback(() => {
    setCurrentStep(0);
    setDirection('forward');
    setFormData({});
    setIsComplete(false);
    setReturnToReview(false);
  }, []);

  return {
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
  };
}
