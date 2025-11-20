import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDelayedNavigation, SECTIONS } from '../contexts/NavigationContext';
import { FaHome, FaLayerGroup, FaTrophy } from 'react-icons/fa';
import './NavBar.css';

const INITIAL_RECT = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  opacity: 0,
};

const rectsAreEqual = (a, b) =>
  Math.abs(a.width - b.width) < 0.5 &&
  Math.abs(a.height - b.height) < 0.5 &&
  Math.abs(a.x - b.x) < 0.5 &&
  Math.abs(a.y - b.y) < 0.5 &&
  Math.abs(a.opacity - b.opacity) < 0.01;

export default function NavBar() {
  const { delayedNavigate, currentSection } = useDelayedNavigation();
  const navContainerRef = useRef(null);
  const pillRefs = useRef({});
  const [highlightRect, setHighlightRect] = useState(INITIAL_RECT);
  const [isHighlightReady, setHighlightReady] = useState(false);

  const navItems = [
    { section: SECTIONS.HOME, path: '/', icon: FaHome, label: 'Home' },
    { section: SECTIONS.DECKS, path: '/decks/build', icon: FaLayerGroup, label: 'Decks' },
    { section: SECTIONS.LEADERBOARDS, path: '/leaderboards', icon: FaTrophy, label: 'Ranks' },
  ];

  const commitHighlightRect = useCallback((nextRect) => {
    setHighlightRect((prev) => (rectsAreEqual(prev, nextRect) ? prev : nextRect));
    if (nextRect.opacity > 0 && !isHighlightReady) {
      setHighlightReady(true);
    }
  }, [isHighlightReady]);

  const calculateRectForSection = useCallback((section) => {
    const containerEl = navContainerRef.current;
    const targetEl = pillRefs.current[section];

    if (!containerEl || !targetEl) {
      return INITIAL_RECT;
    }

    const containerRect = containerEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    return {
      width: targetRect.width,
      height: targetRect.height,
      x: targetRect.left - containerRect.left,
      y: targetRect.top - containerRect.top,
      opacity: 1,
    };
  }, []);

  const moveHighlightToSection = useCallback((section) => {
    const nextRect = calculateRectForSection(section);
    commitHighlightRect(nextRect);
  }, [calculateRectForSection, commitHighlightRect]);

  const handleNavClick = useCallback((section, path) => {
    moveHighlightToSection(section);
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        delayedNavigate(path);
      });
    } else {
      delayedNavigate(path);
    }
  }, [delayedNavigate, moveHighlightToSection]);

  const handleNavPointerDown = useCallback((section) => {
    moveHighlightToSection(section);
  }, [moveHighlightToSection]);

  const updateHighlight = useCallback(() => {
    const nextRect = calculateRectForSection(currentSection);
    commitHighlightRect(nextRect);
  }, [calculateRectForSection, commitHighlightRect, currentSection]);

  useLayoutEffect(() => {
    updateHighlight();
  }, [updateHighlight]);

  useEffect(() => {
    window.addEventListener('resize', updateHighlight);
    return () => {
      window.removeEventListener('resize', updateHighlight);
    };
  }, [updateHighlight]);

  return (
    <div className="top-nav-wrapper">
      <nav ref={navContainerRef} className="top-nav" aria-label="Primary">
        <div
          className={`top-nav-highlight blueprint-material${
            isHighlightReady ? ' top-nav-highlight-ready' : ''
          }`}
          style={{
            transform: `translate3d(${highlightRect.x}px, ${highlightRect.y}px, 0)`,
            width: `${highlightRect.width}px`,
            height: `${highlightRect.height}px`,
            opacity: highlightRect.opacity,
            '--bp-border-padding': '0.55rem',
          }}
        />
        {navItems.map(({ section, path, icon: Icon, label }) => {
          const isActive = currentSection === section;

          return (
            <button
              key={section}
              type="button"
              className={`top-nav-item${isActive ? ' top-nav-item-active' : ''}`}
              onPointerDown={() => handleNavPointerDown(section)}
              onClick={() => handleNavClick(section, path)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                ref={(el) => {
                  if (el) {
                    pillRefs.current[section] = el;
                  } else {
                    delete pillRefs.current[section];
                  }
                }}
                className={`nav-item-pill${isActive ? ' nav-item-pill-active' : ''}`}
              >
                <Icon className="nav-item-icon" />
                <span className="nav-item-label">{label}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

