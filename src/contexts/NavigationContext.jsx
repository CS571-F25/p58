import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationContext = createContext(null);

export const SECTIONS = {
  HOME: 'home',
  DECKS: 'decks',
  LEADERBOARDS: 'leaderboards',
  OTHER: 'other',
};

const getSectionFromPath = (pathname) => {
  if (!pathname) return SECTIONS.OTHER;
  if (pathname === '/' || pathname === '#/' || pathname === '#') return SECTIONS.HOME;
  if (pathname.startsWith('/decks')) return SECTIONS.DECKS;
  if (pathname.startsWith('/leaderboards')) return SECTIONS.LEADERBOARDS;
  return SECTIONS.OTHER;
};

export function NavigationProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [pendingSection, setPendingSection] = useState(null);
  const [currentSection, setCurrentSection] = useState(getSectionFromPath(location.pathname));
  const [previousSection, setPreviousSection] = useState(null);

  const delayedNavigate = useCallback((to, delay = 800) => {
    if (isNavigating) return; // Prevent multiple navigations
    if (location.pathname === to) return; // Already on target page
    
    setIsNavigating(true);
    setPendingNavigation(to);
    setPendingSection(getSectionFromPath(to));
    
    // Wait for exit animation to complete
    setTimeout(() => {
      navigate(to);
      setIsNavigating(false);
      setPendingNavigation(null);
      setPendingSection(null);
    }, delay);
  }, [navigate, isNavigating, location.pathname]);

  useEffect(() => {
    const nextSection = getSectionFromPath(location.pathname);

    setCurrentSection((prevSection) => {
      if (prevSection !== nextSection) {
        setPreviousSection(prevSection);
      }
      return nextSection;
    });
  }, [location.pathname]);

  // Clear pending navigation when location actually changes
  useEffect(() => {
    if (pendingNavigation && location.pathname === pendingNavigation) {
      setIsNavigating(false);
      setPendingNavigation(null);
      setPendingSection(null);
    }
  }, [location.pathname, pendingNavigation]);

  return (
    <NavigationContext.Provider
      value={{
        delayedNavigate,
        isNavigating,
        pendingNavigation,
        pendingSection,
        currentSection,
        previousSection,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useDelayedNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useDelayedNavigation must be used within NavigationProvider');
  }
  return context;
}

