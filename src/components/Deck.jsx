import PropTypes from 'prop-types'
import Card from './Card'
import styles from './Deck.module.css'
import GiantHeroArt from '../assets/Giant_Hero_card_gem.png'
import MusketeerHeroArt from '../assets/Musketeer_Hero_card_gem.png'
import KnightHeroArt from '../assets/Knight_Hero_card_gem.png'
import MiniPekkaHeroArt from '../assets/MiniPekka_Hero_card_gem.png'

const HERO_ART_BY_NAME = {
  Giant: GiantHeroArt,
  Musketeer: MusketeerHeroArt,
  Knight: KnightHeroArt,
  'Mini P.E.K.K.A': MiniPekkaHeroArt,
}

const HERO_SLOT_INDICES = new Set([2, 3])

function Deck({ title, cards, hideLevel, onCardClick, variant, replacedCardIndices }) {
  const safeCards = Array.isArray(cards) ? cards.slice(0, 8) : []

  const paddedCards =
    safeCards.length < 8
      ? [...safeCards, ...Array.from({ length: 8 - safeCards.length }, () => null)]
      : safeCards

  const rootClassName = [
    styles.deckRoot,
    variant === 'optimized' ? styles.deckRootOptimized : '',
    variant === 'large' ? styles.deckRootLarge : '',
  ].filter(Boolean).join(' ')

  const handleCardClick = (card) => {
    if (typeof onCardClick === 'function') {
      onCardClick(card)
    }
  }

  // Convert replacedCardIndices to Set if it's not already
  const replacedSet = replacedCardIndices instanceof Set 
    ? replacedCardIndices 
    : Array.isArray(replacedCardIndices) 
      ? new Set(replacedCardIndices) 
      : new Set()

  return (
    <section className={rootClassName} aria-label={title || 'Deck'}>
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      <div className={styles.grid}>
        {paddedCards.map((card, index) => {
          if (!card) {
            return (
              <div key={`empty-${index}`} className={styles.cardCell}>
                <div className={styles.empty}>Empty</div>
              </div>
            )
          }

          const { id, image, evolutionImage, level, name, rarity } = card

          const heroArt =
            HERO_SLOT_INDICES.has(index) && typeof name === 'string'
              ? HERO_ART_BY_NAME[name]
              : undefined

          // Prefer hero art for top-right slots, then evolution art for slots 0/1
          const displayImage = heroArt
            ? heroArt
            : (index === 0 || index === 1) && evolutionImage
              ? evolutionImage
              : image

          const isReplaced = replacedSet.has(index)

          return (
            <div key={id} className={styles.cardCell}>
              <Card
                id={id}
                image={displayImage}
                level={level}
                name={name}
                rarity={rarity}
                hideLevel={hideLevel}
                onClick={handleCardClick}
                variant={variant}
                isReplaced={isReplaced}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

const cardShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string,
  evolutionImage: PropTypes.string,
  level: PropTypes.number,
  name: PropTypes.string,
})

Deck.propTypes = {
  title: PropTypes.string,
  cards: PropTypes.arrayOf(cardShape).isRequired,
  hideLevel: PropTypes.bool,
  onCardClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'optimized', 'large']),
  replacedCardIndices: PropTypes.oneOfType([
    PropTypes.instanceOf(Set),
    PropTypes.arrayOf(PropTypes.number),
  ]),
}

Deck.defaultProps = {
  title: undefined,
  hideLevel: false,
  onCardClick: undefined,
  variant: 'default',
  replacedCardIndices: undefined,
}

export default Deck


