import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ClashCard from './ClashCard'
import { useDelayedNavigation } from '../contexts/NavigationContext'
import './Build.css'

const PLACEHOLDER_CARD_DATA = [
  { id: 1, label: 'Hog Rider', color: '#3b82f6' },
  { id: 2, label: 'Balloon', color: '#f97316' },
  { id: 3, label: 'P.E.K.K.A', color: '#8b5cf6' },
  { id: 4, label: 'X-Bow', color: '#14b8a6' },
  { id: 5, label: 'Royal Giant', color: '#facc15' },
  { id: 6, label: 'Lava Hound', color: '#ef4444' },
  { id: 7, label: 'Goblin Drill', color: '#22c55e' },
]

const createPlaceholderImage = (hexColor) => {
  const sanitized = hexColor.replace('#', '')
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140'><defs><linearGradient id='shine' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23ffffff' stop-opacity='0.22'/><stop offset='35%' stop-color='%23ffffff' stop-opacity='0.06'/><stop offset='100%' stop-color='%23ffffff' stop-opacity='0.12'/></linearGradient></defs><rect width='100' height='140' rx='14' fill='%23${sanitized}'/><rect width='100' height='140' rx='14' fill='url(%23shine)'/></svg>`
}

const PLACEHOLDER_CARDS = PLACEHOLDER_CARD_DATA.map((card) => ({
  ...card,
  imageSrc: createPlaceholderImage(card.color),
}))

const VISIBLE_OFFSETS = [-2, -1, 0, 1, 2]
const ANIMATION_DURATION = 420
const BUILD_ROUTE = '/decks/build'

export default function Build() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState('next')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExitingView, setIsExitingView] = useState(false)
  const animationTimerRef = useRef(null)
  const { pendingNavigation } = useDelayedNavigation()
  const location = useLocation()
  const cardCount = PLACEHOLDER_CARDS.length
  const useStableKeys = cardCount >= VISIBLE_OFFSETS.length

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        window.clearTimeout(animationTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (location.pathname === BUILD_ROUTE) {
      setIsExitingView(false)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!pendingNavigation) return
    if (pendingNavigation !== BUILD_ROUTE) {
      setIsExitingView(true)
    }
  }, [pendingNavigation])

  const visibleCards = useMemo(() => {
    if (cardCount === 0) return []

    return VISIBLE_OFFSETS.map((offset) => {
      const normalizedIndex =
        (activeIndex + offset + cardCount) % cardCount
      const card = PLACEHOLDER_CARDS[normalizedIndex]

      return {
        ...card,
        offset,
      }
    })
  }, [activeIndex, cardCount])

  const startAnimation = (nextDirection) => {
    setDirection(nextDirection)
    setIsAnimating(true)

    if (animationTimerRef.current) {
      window.clearTimeout(animationTimerRef.current)
    }

    animationTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false)
      animationTimerRef.current = null
    }, ANIMATION_DURATION)
  }

  const handlePrevious = () => {
    startAnimation('previous')
    setActiveIndex((current) =>
      (current - 1 + cardCount) % cardCount
    )
  }

  const handleNext = () => {
    startAnimation('next')
    setActiveIndex((current) =>
      (current + 1) % cardCount
    )
  }

  return (
    <div
      className={`build-page animate__animated ${
        isExitingView ? 'animate__fadeOut' : 'animate__fadeIn'
      } animate__faster`}
    >
      <div className="build-carousel">
        <button
          type="button"
          className="carousel-button carousel-button--left"
          onClick={handlePrevious}
          aria-label="Show previous card"
        >
          &#8592;
        </button>

        <div
          className="carousel-stage"
          aria-live="polite"
          data-direction={direction}
          data-animating={isAnimating ? 'true' : 'false'}
        >
          {visibleCards.map((card) => (
            <div
              key={useStableKeys ? card.id : `${card.id}-${card.offset}`}
              className="carousel-card"
              data-offset={card.offset}
              data-direction={direction}
            >
              <ClashCard imageSrc={card.imageSrc} alt={card.label} />
              <span className="carousel-card__label">
                {card.label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel-button carousel-button--right"
          onClick={handleNext}
          aria-label="Show next card"
        >
          &#8594;
        </button>
      </div>

      <p className="carousel-helper-text">
        Placeholder win condition cards. Use the arrows to explore.
      </p>
    </div>
  )
}

