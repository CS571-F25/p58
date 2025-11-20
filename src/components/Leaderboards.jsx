import leftLeaderBoard from '../assets/Left-Leader-Board.png';
import rightLeaderBoard from '../assets/Right-Leader-Board.png';
import { SECTIONS } from '../contexts/NavigationContext';
import { useSectionTransition } from '../hooks/useSectionTransition';
import './Leaderboards.css';

const composeTransform = (baseTransform, rotate = 0, scale = 1, flip = false) => {
  const transforms = [];

  if (baseTransform) {
    transforms.push(baseTransform.trim());
  }

  if (typeof rotate === 'number' && rotate !== 0) {
    transforms.push(`rotate(${rotate}deg)`);
  }

  if (typeof scale === 'number') {
    transforms.push(`scale(${scale})`);
  }

  if (flip) {
    transforms.push('scaleX(-1)');
  }

  return transforms.join(' ').trim();
};

const LEFT_IMAGES = [
  {
    id: 'left-board',
    src: leftLeaderBoard,
    alt: 'Left Leaderboard Characters',
    className: 'leaderboards-figure-wrapper--left-board',
    rotate: 0,
    scale: 4.5,
    flip: false,
    layer: 2,
    animationDirection: 'left',
    style: {
      left: '40vw',
      bottom: '25vh',
      width: 'clamp(320px, 36vw, 520px)',
      '--overlay-duration': '0.9s',
    },
  },
];

const RIGHT_IMAGES = [
  {
    id: 'right-board',
    src: rightLeaderBoard,
    alt: 'Right Leaderboard Characters',
    className: 'leaderboards-figure-wrapper--right-board',
    rotate: 0,
    scale: 4.5,
    flip: false,
    layer: 2,
    animationDirection: 'right',
    style: {
      right: '40vw',
      bottom: '25vh',
      width: 'clamp(320px, 36vw, 520px)',
      '--overlay-duration': '0.9s',
    },
  },
];

export default function Leaderboards() {
  const { isExiting, shouldRender, shouldAnimate, phase } = useSectionTransition(SECTIONS.LEADERBOARDS, {
    animationDuration: 1000,
  });

  if (!shouldRender) {
    return null;
  }

  const isPreEnter = phase === 'entering' && !shouldAnimate;

  const getAnimatedClasses = (base, direction = 'right') =>
    shouldAnimate
      ? `${base} animate__animated ${
          isExiting
            ? direction === 'left'
              ? 'animate__bounceOutLeft'
              : 'animate__bounceOutRight'
            : direction === 'left'
            ? 'animate__bounceInLeft'
            : 'animate__bounceInRight'
        }`
      : base;

  return (
    <section
      className="leaderboards-stage"
      style={{
        visibility: isPreEnter ? 'hidden' : 'visible',
      }}
    >
      <div
        className="leaderboards-overlay-wrapper leaderboards-overlay-wrapper--left"
        style={{ visibility: isPreEnter ? 'hidden' : 'visible' }}
      >
        <div className="leaderboards-overlay-skew leaderboards-overlay-skew--left">
          <div
            className={getAnimatedClasses(
              'leaderboards-overlay-panel leaderboards-overlay-panel--left blueprint-material',
              'left'
            )}
            style={{
              animationDuration: '0.95s',
              animationDelay: shouldAnimate ? '0.2s' : '0s',
              '--animate-duration': '0.95s',
              '--animate-delay': shouldAnimate ? '0.2s' : '0s',
            }}
          />
        </div>
        {LEFT_IMAGES.map(
          (
            {
              id,
              className,
              style = {},
              rotate = 0,
              scale = 1,
              flip = false,
              layer,
              animationDirection,
              imageClassName,
              ...imageProps
            },
            index,
          ) => {
            const {
              transform: baseTransform,
              transformOrigin,
              ['--overlay-duration']: overlayDuration,
              ...restStyle
            } = style;

            const finalTransform = composeTransform(baseTransform, rotate, scale, flip);
            const resolvedOverlayDuration = overlayDuration ?? '0.9s';
            const animationDelay = shouldAnimate ? '0s' : '0s';
            const direction = animationDirection ?? 'left';

            const wrapperStyle = {
              ...restStyle,
              ...(layer !== undefined ? { zIndex: layer } : {}),
              animationDuration: resolvedOverlayDuration,
              animationDelay,
              '--animate-duration': resolvedOverlayDuration,
              '--animate-delay': animationDelay,
            };

            const imageStyle = {
              transform: finalTransform,
              transformOrigin: transformOrigin ?? 'center center',
            };

            const wrapperClassName = getAnimatedClasses(
              `leaderboards-figure-wrapper ${className ?? ''}`,
              direction,
            );

            const figureClassName = `leaderboards-figure ${imageClassName ?? ''}`.trim();

            return (
              <div key={`left-${id ?? index}`} className={wrapperClassName} style={wrapperStyle}>
                <img {...imageProps} className={figureClassName} style={imageStyle} />
              </div>
            );
          },
        )}
      </div>

      <div
        className="leaderboards-overlay-wrapper leaderboards-overlay-wrapper--right"
        style={{ visibility: isPreEnter ? 'hidden' : 'visible' }}
      >
        <div className="leaderboards-overlay-skew leaderboards-overlay-skew--right">
          <div
            className={getAnimatedClasses(
              'leaderboards-overlay-panel leaderboards-overlay-panel--right blueprint-material',
              'right'
            )}
            style={{
              animationDuration: '0.95s',
              animationDelay: shouldAnimate ? '0.2s' : '0s',
              '--animate-duration': '0.95s',
              '--animate-delay': shouldAnimate ? '0.2s' : '0s',
            }}
          />
        </div>
        {RIGHT_IMAGES.map(
          (
            {
              id,
              className,
              style = {},
              rotate = 0,
              scale = 1,
              flip = false,
              layer,
              animationDirection,
              imageClassName,
              ...imageProps
            },
            index,
          ) => {
            const {
              transform: baseTransform,
              transformOrigin,
              ['--overlay-duration']: overlayDuration,
              ...restStyle
            } = style;

            const finalTransform = composeTransform(baseTransform, rotate, scale, flip);
            const resolvedOverlayDuration = overlayDuration ?? '0.9s';
            const animationDelay = shouldAnimate ? '0s' : '0s';
            const direction = animationDirection ?? 'right';

            const wrapperStyle = {
              ...restStyle,
              ...(layer !== undefined ? { zIndex: layer } : {}),
              animationDuration: resolvedOverlayDuration,
              animationDelay,
              '--animate-duration': resolvedOverlayDuration,
              '--animate-delay': animationDelay,
            };

            const imageStyle = {
              transform: finalTransform,
              transformOrigin: transformOrigin ?? 'center center',
            };

            const wrapperClassName = getAnimatedClasses(
              `leaderboards-figure-wrapper ${className ?? ''}`,
              direction,
            );

            const figureClassName = `leaderboards-figure ${imageClassName ?? ''}`.trim();

            return (
              <div key={`right-${id ?? index}`} className={wrapperClassName} style={wrapperStyle}>
                <img {...imageProps} className={figureClassName} style={imageStyle} />
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}

