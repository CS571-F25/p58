import { useEffect, useRef, useState } from 'react';
import { useDelayedNavigation } from '../contexts/NavigationContext';

const DEFAULT_ANIMATION_DURATION = 800;

export function useSectionTransition(
  targetSection,
  { animationDuration = DEFAULT_ANIMATION_DURATION } = {}
) {
  const { pendingSection, currentSection } = useDelayedNavigation();

  const prevSectionRef = useRef(currentSection);
  const exitAnimationStartedRef = useRef(false);

  const isInitialOnTarget = currentSection === targetSection;

  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(isInitialOnTarget);
  const [shouldAnimate, setShouldAnimate] = useState(isInitialOnTarget);
  const [phase, setPhase] = useState(isInitialOnTarget ? 'entered' : 'exited');

  useEffect(() => {
    let animationTimerId;
    let frameId;

    const previousSection = prevSectionRef.current;
    const isOnTarget = currentSection === targetSection;
    const enteringTarget = isOnTarget && previousSection !== targetSection;
    const stayingOnTarget = isOnTarget && previousSection === targetSection;
    const exitTriggered =
      previousSection === targetSection &&
      pendingSection &&
      pendingSection !== targetSection;
    const leavingTarget = !isOnTarget && previousSection === targetSection;

    if (exitTriggered && !exitAnimationStartedRef.current) {
      exitAnimationStartedRef.current = true;
      setPhase('exiting');
      setIsExiting(true);
      setShouldRender(true);

      frameId = requestAnimationFrame(() => {
        setShouldAnimate(true);
      });

      animationTimerId = setTimeout(() => {
        setShouldRender(false);
        setShouldAnimate(false);
        setIsExiting(false);
        setPhase('exited');
        exitAnimationStartedRef.current = false;
      }, animationDuration);
    } else if (enteringTarget) {
      exitAnimationStartedRef.current = false;
      setPhase('entering');
      setIsExiting(false);
      setShouldRender(true);

      frameId = requestAnimationFrame(() => {
        setShouldAnimate(true);
      });

      animationTimerId = setTimeout(() => {
        setShouldAnimate(false);
        setPhase('entered');
      }, animationDuration);
    } else if (stayingOnTarget) {
      if (!exitAnimationStartedRef.current) {
        setIsExiting(false);
        setShouldRender(true);
        setShouldAnimate(false);
        setPhase('entered');
      }
    } else if (leavingTarget || !isOnTarget) {
      if (!exitAnimationStartedRef.current) {
        setShouldRender(false);
        setShouldAnimate(false);
        setIsExiting(false);
        setPhase('exited');
      }
    }

    prevSectionRef.current = currentSection;

    return () => {
      if (animationTimerId) clearTimeout(animationTimerId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [
    currentSection,
    pendingSection,
    targetSection,
    animationDuration,
  ]);

  return {
    isExiting,
    shouldRender,
    shouldAnimate,
    phase,
    animationDuration,
  };
}

