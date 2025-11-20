import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SECTIONS } from '../contexts/NavigationContext';
import { FaSearch, FaHammer, FaBox } from 'react-icons/fa';
import buildersImage from '../assets/Decks-Nav-Builders.png';
import woodBackground from '../assets/wood-board-background2.jpg';
import { useSectionTransition } from '../hooks/useSectionTransition';
import DelayedLink from './DelayedLink';

export default function DecksNav() {
  const location = useLocation();
  const transition = useSectionTransition(SECTIONS.DECKS, {
    animationDuration: 1000,
  });
  const { isExiting, shouldRender, shouldAnimate, phase } = transition;

  const isPreEnter = phase === 'entering' && !shouldAnimate;

  const navItems = useMemo(
    () => [
      { path: '/decks/search', icon: FaSearch, label: 'Search' },
      { path: '/decks/build', icon: FaHammer, label: 'Build' },
      { path: '/decks/cache', icon: FaBox, label: 'Cache' },
    ],
    []
  );

  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const boardRef = useRef(null);
  const [indicatorRect, setIndicatorRect] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [boardDimensions, setBoardDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [cutoutData, setCutoutData] = useState([]);
  const [slideDirection, setSlideDirection] = useState('right');
  const [leavingPath, setLeavingPath] = useState(null);

  const activePath = useMemo(() => {
    if (location.pathname === '/decks') {
      return '/decks/build';
    }
    const matched = navItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + '/')
    );
    return matched ? matched.path : '/decks/build';
  }, [location.pathname, navItems]);

  const isActive = (path) => activePath === path;
  const activeIndex = useMemo(
    () => navItems.findIndex((item) => item.path === activePath),
    [activePath, navItems]
  );
  const resolvedActiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const leavingIndex = useMemo(() => {
    if (!leavingPath) return null;
    const index = navItems.findIndex((item) => item.path === leavingPath);
    return index === -1 ? null : index;
  }, [leavingPath, navItems]);
  const previousActiveRef = useRef(activePath);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const previousPath = previousActiveRef.current;
    if (previousPath === activePath) {
      return;
    }

    const previousIndex = navItems.findIndex((item) => item.path === previousPath);
    const nextIndex = navItems.findIndex((item) => item.path === activePath);
    const direction = nextIndex > previousIndex ? 'right' : 'left';

    setSlideDirection(direction);
    setLeavingPath(previousPath);

    previousActiveRef.current = activePath;

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => {
      setLeavingPath(null);
    }, 520);
  }, [activePath, navItems]);

  const updateIndicator = useCallback(() => {
    const navEl = navRef.current;
    const boardEl = boardRef.current;
    const activeEl = activePath ? buttonRefs.current[activePath] : null;

    if (!navEl || !boardEl || !activeEl) {
      setIndicatorRect((prev) =>
        prev.opacity === 0 ? prev : { ...prev, opacity: 0 }
      );
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const boardRect = boardEl.getBoundingClientRect();
    const buttonRect = activeEl.getBoundingClientRect();
    const horizontalPadding = 0;
    const verticalPadding = 0;

    const width = buttonRect.width + horizontalPadding;
    const height = buttonRect.height + verticalPadding;
    const x = buttonRect.left - boardRect.left - horizontalPadding / 2;
    const y = buttonRect.top - boardRect.top - verticalPadding / 2;

    setBoardDimensions((prev) =>
      prev.width !== boardRect.width || prev.height !== boardRect.height
        ? { width: boardRect.width, height: boardRect.height }
        : prev
    );

    const cutouts = navItems
      .map((item) => {
        const btnEl = buttonRefs.current[item.path];
        if (!btnEl) return null;
        const rect = btnEl.getBoundingClientRect();
        const centerX = rect.left - boardRect.left + rect.width / 2;
        const centerY = rect.top - boardRect.top + rect.height / 2;
        const radius = Math.max(rect.width, rect.height) / 2;
        return {
          path: item.path,
          x: centerX,
          y: centerY,
          radius,
        };
      })
      .filter(Boolean);

    setCutoutData((prev) => {
      if (prev.length !== cutouts.length) return cutouts;
      for (let i = 0; i < cutouts.length; i += 1) {
        const prevItem = prev[i];
        const nextItem = cutouts[i];
        if (
          !prevItem ||
          !nextItem ||
          prevItem.path !== nextItem.path ||
          Math.abs(prevItem.x - nextItem.x) > 0.5 ||
          Math.abs(prevItem.y - nextItem.y) > 0.5 ||
          Math.abs(prevItem.radius - nextItem.radius) > 0.5
        ) {
          return cutouts;
        }
      }
      return prev;
    });

    setIndicatorRect({
      width,
      height,
      x,
      y,
      opacity: 1,
    });
  }, [activePath]);

  const boardClipPath = useMemo(() => {
    if (
      !boardDimensions.width ||
      !boardDimensions.height ||
      cutoutData.length === 0
    ) {
      return undefined;
    }

    const { width, height } = boardDimensions;
    const rectPath = `M0 0 H${width.toFixed(2)} V${height.toFixed(
      2
    )} H0 Z`;
    const holes = cutoutData
      .map(({ x, y, radius }) => {
        const top = (y - radius).toFixed(2);
        const bottom = (y + radius).toFixed(2);
        const cx = x.toFixed(2);
        const r = radius.toFixed(2);
        return `M${cx} ${top} A ${r} ${r} 0 1 1 ${cx} ${bottom} A ${r} ${r} 0 1 1 ${cx} ${top} Z`;
      })
      .join(' ');

    return `path('evenodd', '${rectPath} ${holes}')`;
  }, [boardDimensions, cutoutData]);

  useLayoutEffect(() => {
    if (!shouldRender || isPreEnter) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      updateIndicator();
    });

    return () => cancelAnimationFrame(frame);
  }, [activePath, isPreEnter, shouldRender, updateIndicator]);

  useEffect(() => {
    if (!shouldRender || isPreEnter) {
      return;
    }

    updateIndicator();

    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldRender, isPreEnter, updateIndicator]);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    setIndicatorRect((prev) =>
      prev.opacity === 0 ? prev : { ...prev, opacity: 0 }
    );
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <>
      <style>{`
        .decks-nav-blueprint::before {
          border-top-left-radius: calc(50vh - 1.5rem) !important;
          border-top-right-radius: calc(50vh - 1.5rem) !important;
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-bottom: none !important;
        }
        .decks-nav-blueprint::after {
          border-top-left-radius: calc(50vh - 1.5rem - 2px) !important;
          border-top-right-radius: calc(50vh - 1.5rem - 2px) !important;
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        .decks-nav-container {
          --animate-duration: 0.8s;
        }
        .builder-image {
          --animate-duration: 0.8s;
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '-50px', // Extend below viewport
          left: '50%',
          transform: 'translateX(-50%)',
          width: '87.5%',
          height: 'calc(22.22vh + 50px)', // 2/9 of viewport height + extra for off-screen
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
          paddingTop: '1px', // Allow outline to show at top
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: phase === 'exited' ? 'none' : 'auto',
            visibility: isPreEnter ? 'hidden' : 'visible',
          }}
        >
          <div
            className={`decks-nav-container ${shouldAnimate ? 'animate__animated' : ''} ${
              shouldAnimate ? (isExiting ? 'animate__bounceOutDown' : 'animate__bounceInUp') : ''
            }`}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              animationDelay: shouldAnimate ? '0.2s' : '0s',
              '--animate-delay': shouldAnimate ? '0.2s' : '0s',
            }}
          >
      <div
        className="nav-blueprint-backdrop"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        {/* Bottom navigation bar with blueprint material */}
        <div
          ref={boardRef}
          className="blueprint-material decks-nav-blueprint"
          style={{
            position: 'absolute',
            bottom: '-50px', // Extend below viewport
            left: 0,
            right: 0,
            top: '-1px', // Account for outline
            width: '100%',
            height: 'calc(100% + 50px + 1px)', // Extend beyond container + outline
            borderTopLeftRadius: '50vh',
            borderTopRightRadius: '50vh',
            zIndex: 2,
            clipPath: boardClipPath,
            WebkitClipPath: boardClipPath,
            pointerEvents: 'none',
            visibility: boardClipPath ? 'visible' : 'hidden',
          }}
        />
        <div
          className="nav-blueprint-indicator"
          style={{
            width: `${indicatorRect.width}px`,
            height: `${indicatorRect.height}px`,
            opacity: indicatorRect.opacity,
            transform: `translate3d(${indicatorRect.x}px, ${indicatorRect.y}px, 0)`,
            transitionDelay: shouldAnimate ? '0.2s' : '0s',
            zIndex: 1,
          }}
        />
      </div>

      {/* Navigation buttons */}
      <nav
        ref={navRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6rem',
          position: 'absolute',
          bottom: '5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          width: '100%',
          overflow: 'visible',
        }}
      >
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          const isLeaving = leavingPath === item.path;
          const relativeIndex = index - resolvedActiveIndex;
          const defaultTransform =
            relativeIndex > 0 ? 'translateX(-120%)' : 'translateX(120%)';
          const isTransit =
            leavingPath &&
            leavingIndex !== null &&
            ((slideDirection === 'right' &&
              index > leavingIndex &&
              index < resolvedActiveIndex) ||
              (slideDirection === 'left' &&
                index < leavingIndex &&
                index > resolvedActiveIndex));
          let blueprintTransform;
          if (active) {
            blueprintTransform = 'translateX(0%)';
          } else if (isLeaving) {
            blueprintTransform =
              slideDirection === 'right' ? 'translateX(120%)' : 'translateX(-120%)';
          } else if (isTransit) {
            blueprintTransform =
              slideDirection === 'right' ? 'translateX(120%)' : 'translateX(-120%)';
          } else {
            blueprintTransform = defaultTransform;
          }
          const shouldAnimateBlueprint = active || isLeaving;
          const blueprintTransition = shouldAnimateBlueprint
            ? 'transform 0.45s cubic-bezier(0.24, 0.8, 0.25, 1)'
            : 'transform 0.0001s linear';
          const blueprintAnimation = isTransit
            ? `${
                slideDirection === 'right'
                  ? 'nav-button-blueprint-transit-right'
                  : 'nav-button-blueprint-transit-left'
              } 0.45s cubic-bezier(0.24, 0.8, 0.25, 1) forwards`
            : 'none';
          const Icon = item.icon;
          const LinkComponent = DelayedLink;

          return (
            <LinkComponent
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              data-index={index}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
              }}
            >
              <div
                className={`nav-button-surface${active ? ' nav-button-surface--active' : ''}`}
                ref={(el) => {
                  if (el) {
                    buttonRefs.current[item.path] = el;
                  } else {
                    delete buttonRefs.current[item.path];
                  }
                }}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: `url(${woodBackground})`,
                  backgroundSize: '10vw 10vw',
                  backgroundRepeat: 'repeat',
                  backgroundPosition: 'center',
                  backgroundColor: 'transparent',
                  border: active
                    ? '2px solid rgba(255, 255, 255, 0.82)'
                    : '2px solid rgba(255, 255, 255, 0.38)',
                  transition:
                    'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 3,
                  overflow: 'hidden',
                  boxShadow: active
                    ? '0 16px 32px rgba(0, 0, 0, 0.45)'
                    : '0 8px 20px rgba(0, 0, 0, 0.18)',
                  transform: active ? 'translateY(-12px)' : 'translateY(0)',
                }}
              >
                <div
                  className="nav-button-blueprint"
                  data-active={active ? 'true' : 'false'}
                  data-leaving={isLeaving ? 'true' : 'false'}
                  style={{
                    transform: blueprintTransform,
                    transition: isTransit ? 'transform 0s linear' : blueprintTransition,
                    animation: blueprintAnimation,
                  }}
                />
                <Icon 
                  style={{ 
                    fontSize: '2.2rem',
                    color: active ? '#fdfdfd' : 'rgba(255, 255, 255, 0.68)',
                    zIndex: 2,
                    position: 'relative',
                    transition: 'color 0.3s ease, transform 0.4s ease',
                    transform: active ? 'translateY(-2px)' : 'translateY(0)',
                  }} 
                />
              </div>
            </LinkComponent>
          );
        })}
      </nav>
      
      {/* Builder image */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-110%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          pointerEvents: 'none',
          visibility: isPreEnter ? 'hidden' : 'visible',
        }}
      >
        <img
          src={buildersImage}
          alt="Builders"
          className={`builder-image ${shouldAnimate ? 'animate__animated' : ''} ${
            shouldAnimate ? (isExiting ? 'animate__bounceOutDown' : 'animate__bounceInUp') : ''
          }`}
          style={{
            height: '1400px',
            width: 'auto',
            animationDelay: shouldAnimate ? '0s' : '0s',
            '--animate-delay': '0s',
          }}
        />
      </div>
          </div>
        </div>
      </div>
    </>
  );
}

