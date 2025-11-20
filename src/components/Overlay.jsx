import { SECTIONS } from '../contexts/NavigationContext';
import blueKingJumping from '../assets/blue-king-jumping.png';
import { useSectionTransition } from '../hooks/useSectionTransition';
import './Overlay.css';

export default function Overlay() {
  const transition = useSectionTransition(SECTIONS.HOME, {
    animationDuration: 1000,
  });
  const { isExiting, shouldRender, shouldAnimate, phase } = transition;

  if (!shouldRender) return null;

  const isPreEnter = phase === 'entering' && !shouldAnimate;

  return (
    <>
      <div
        className="overlay-wrapper"
        style={{
          visibility: isPreEnter ? 'hidden' : 'visible',
        }}
      >
        <div className="overlay-skew">
          <div 
            key={`overlay-${isExiting ? 'exit' : 'enter'}-${shouldAnimate}`}
            className={`overlay blueprint-material ${shouldAnimate ? 'animate__animated' : ''} ${
              shouldAnimate ? (isExiting ? 'animate__bounceOutRight' : 'animate__bounceInRight') : ''
            }`}
            style={{
              animationDelay: shouldAnimate ? '0.2s' : '0s',
              '--animate-delay': shouldAnimate ? '0.2s' : '0s',
            }}
          >
            {/* Overlay content can go here */}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'inline-block',
          pointerEvents: 'none',
          visibility: isPreEnter ? 'hidden' : 'visible',
        }}
      >
        <img 
          key={`overlay-image-${isExiting ? 'exit' : 'enter'}-${shouldAnimate}`}
          src={blueKingJumping} 
          alt="Blue King Jumping" 
          className={`overlay-image ${shouldAnimate ? 'animate__animated' : ''} ${
            shouldAnimate ? (isExiting ? 'animate__bounceOutRight' : 'animate__bounceInRight') : ''
          }`}
          style={{
            animationDelay: shouldAnimate ? '0s' : '0s',
            '--animate-delay': '0s',
          }}
        />
      </div>
    </>
  );
}

