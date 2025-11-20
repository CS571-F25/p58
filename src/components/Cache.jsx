import ClashDeck from './ClashDeck'
import './Cache.css'

const createPlaceholderImage = (hexColor) => {
  const sanitized = hexColor.replace('#', '')

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140'><defs><linearGradient id='shine' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23ffffff' stop-opacity='0.22'/><stop offset='35%' stop-color='%23ffffff' stop-opacity='0.06'/><stop offset='100%' stop-color='%23ffffff' stop-opacity='0.12'/></linearGradient></defs><rect width='100' height='140' rx='14' fill='%23${sanitized}'/><rect width='100' height='140' rx='14' fill='url(%23shine)'/></svg>`
}

const createCard = (label, color) => ({
  imageSrc: createPlaceholderImage(color),
  alt: label,
})

const SWIM_LANES = [
  {
    id: 'hog-cycle',
    title: 'Hog Rider Cycle',
    description:
      'Fast cycle decks that revolve around constant Hog pressure and tight defensive fundamentals.',
    decks: [
      {
        id: 'hog-26-classic',
        name: '2.6 Classic Hog',
        averageElixir: '2.6',
        tags: ['Cycle', 'Fireball'],
        notes:
          'Straightforward ladder staple that keeps Hog pressure rolling with cheap bait and strong single-target defense.',
        cards: [
          createCard('Hog Rider', '#fb923c'),
          createCard('Ice Spirit', '#38bdf8'),
          createCard('Ice Golem', '#bae6fd'),
          createCard('Cannon', '#1f2937'),
          createCard('Musketeer', '#2563eb'),
          createCard('Fireball', '#f97316'),
          createCard('The Log', '#9ca3af'),
          createCard('Skeletons', '#c084fc'),
        ],
      },
      {
        id: 'hog-eq-cycle',
        name: 'Hog EQ Cycle',
        averageElixir: '2.8',
        tags: ['Cycle', 'Earthquake'],
        notes:
          'Pairs Earthquake with Hog to punish building-heavy defenses while keeping a low-elixir rotation.',
        cards: [
          createCard('Hog Rider', '#fb923c'),
          createCard('Earthquake', '#eab308'),
          createCard('Fire Spirit', '#f97316'),
          createCard('Giant Snowball', '#60a5fa'),
          createCard('Skeletons', '#c084fc'),
          createCard('Bomb Tower', '#3b82f6'),
          createCard('Archer Queen', '#a855f7'),
          createCard('The Log', '#9ca3af'),
        ],
      },
      {
        id: 'hog-mortar-hybrid',
        name: 'Hog Mortar Hybrid',
        averageElixir: '3.1',
        tags: ['Hybrid', 'Siege'],
        notes:
          'Mortar controls space on defense and forces awkward placements that soften the path for Hog chip damage.',
        cards: [
          createCard('Hog Rider', '#fb923c'),
          createCard('Mortar', '#0f172a'),
          createCard('Archers', '#93c5fd'),
          createCard('Ice Spirit', '#38bdf8'),
          createCard('Skeletons', '#c084fc'),
          createCard('Fireball', '#f97316'),
          createCard('The Log', '#9ca3af'),
          createCard('Musketeer', '#2563eb'),
        ],
      },
    ],
  },
  {
    id: 'royal-giant-control',
    title: 'Royal Giant Control',
    description:
      'Control-style Royal Giant decks that lean on patience, counter-pushes, and heavy spell value.',
    decks: [
      {
        id: 'rg-fisherman-control',
        name: 'RG Fisherman Control',
        averageElixir: '4.1',
        tags: ['Control', 'Lightning'],
        notes:
          'Fisherman and Hunter lock down tanks while Lightning clears medium troops that stall the Royal Giant.',
        cards: [
          createCard('Royal Giant', '#f59e0b'),
          createCard('Fisherman', '#06b6d4'),
          createCard('Mother Witch', '#9333ea'),
          createCard('Hunter', '#1d4ed8'),
          createCard('Phoenix', '#fb7185'),
          createCard('Lightning', '#facc15'),
          createCard('Barbarian Barrel', '#f97316'),
          createCard('Electro Spirit', '#38bdf8'),
        ],
      },
      {
        id: 'rg-archer-queen',
        name: 'RG Archer Queen',
        averageElixir: '3.8',
        tags: ['Pressure', 'Lightning'],
        notes:
          'Archer Queen and Lightning make it easy to reset defenders and exploit the three-card cycle window.',
        cards: [
          createCard('Royal Giant', '#f59e0b'),
          createCard('Archer Queen', '#a855f7'),
          createCard('Skeleton King', '#f97316'),
          createCard('Fisherman', '#06b6d4'),
          createCard('Golden Knight', '#fbbf24'),
          createCard('Electro Spirit', '#38bdf8'),
          createCard('Lightning', '#facc15'),
          createCard('The Log', '#9ca3af'),
        ],
      },
      {
        id: 'rg-monk-pressure',
        name: 'RG Monk Pressure',
        averageElixir: '4.0',
        tags: ['Monk', 'Dual Lane'],
        notes:
          'Monk ability blocks spell damage while Zappies and Mother Witch stall pushes for a decisive counter-strike.',
        cards: [
          createCard('Royal Giant', '#f59e0b'),
          createCard('Monk', '#f97316'),
          createCard('Phoenix', '#fb7185'),
          createCard('Fisherman', '#06b6d4'),
          createCard('Zappies', '#60a5fa'),
          createCard('Mother Witch', '#9333ea'),
          createCard('Goblin Cage', '#22c55e'),
          createCard('Lightning', '#facc15'),
        ],
      },
    ],
  },
  {
    id: 'miner-control',
    title: 'Miner Control',
    description:
      'Chip-oriented Miner decks that win by stacking small advantages, spell cycling, and surgical tower damage.',
    decks: [
      {
        id: 'miner-poison-control',
        name: 'Miner Poison Control',
        averageElixir: '3.1',
        tags: ['Chip', 'Poison'],
        notes:
          'Classic miner control build that chips with Poison cycles, Wall Breakers pressure, and Tornado resets.',
        cards: [
          createCard('Miner', '#fde047'),
          createCard('Poison', '#9333ea'),
          createCard('Valkyrie', '#f97316'),
          createCard('Magic Archer', '#60a5fa'),
          createCard('Wall Breakers', '#ef4444'),
          createCard('Bomb Tower', '#3b82f6'),
          createCard('Tornado', '#22d3ee'),
          createCard('The Log', '#9ca3af'),
        ],
      },
      {
        id: 'miner-mighty-miner',
        name: 'Miner Mighty Miner',
        averageElixir: '3.4',
        tags: ['Chip', 'Phoenix'],
        notes:
          'Mighty Miner tank swaps and Phoenix recycling keep control while Miner chips away with safe placements.',
        cards: [
          createCard('Miner', '#fde047'),
          createCard('Mighty Miner', '#fb923c'),
          createCard('Poison', '#9333ea'),
          createCard('Phoenix', '#fb7185'),
          createCard('Goblins', '#22c55e'),
          createCard('Bomb Tower', '#3b82f6'),
          createCard('Barbarian Barrel', '#f97316'),
          createCard('Fireball', '#ea580c'),
        ],
      },
      {
        id: 'miner-cart-control',
        name: 'Miner Cannon Cart',
        averageElixir: '3.3',
        tags: ['Control', 'Bridge'],
        notes:
          'Cannon Cart anchors defense and converts into pressure while Poison secures tower damage in double elixir.',
        cards: [
          createCard('Miner', '#fde047'),
          createCard('Cannon Cart', '#1f2937'),
          createCard('Skeleton King', '#f97316'),
          createCard('Flying Machine', '#38bdf8'),
          createCard('Guards', '#22c55e'),
          createCard('Arrows', '#ef4444'),
          createCard('Poison', '#9333ea'),
          createCard('Tombstone', '#0f172a'),
        ],
      },
    ],
  },
]

export default function Cache() {
  return (
    <div className="cache-page">
      <header className="cache-page__intro">
        <h1 className="cache-page__title">Deck Cache</h1>
        <p className="cache-page__subtitle">
          Curated example lanes that group reference decks by win condition. Browse the swim lanes to
          explore how each archetype approaches the battlefield.
        </p>
      </header>

      <div className="cache-page__lanes">
        {SWIM_LANES.map((lane) => (
          <section key={lane.id} className="cache-lane">
            <div className="cache-lane__header">
              <h2 className="cache-lane__title">{lane.title}</h2>
              <p className="cache-lane__description">{lane.description}</p>
            </div>

            <div className="cache-lane__scroll" role="list">
              {lane.decks.map((deck) => (
                <article key={deck.id} className="cache-lane__item" role="listitem">
                  <ClashDeck cards={deck.cards} />

                  <div className="cache-lane__deck-meta">
                    <h3 className="cache-lane__deck-name">{deck.name}</h3>
                    <div className="cache-lane__badge-row">
                      <span className="cache-lane__badge">
                        Avg Elixir {deck.averageElixir}
                      </span>
                      {deck.tags.map((tag) => (
                        <span key={`${deck.id}-${tag}`} className="cache-lane__badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {deck.notes ? <p className="cache-lane__notes">{deck.notes}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
