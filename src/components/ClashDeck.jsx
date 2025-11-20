import ClashCard from './ClashCard';
import blueKingJumping from '../assets/blue-king-jumping.png';
import kingLaughing from '../assets/king_laughing.gif';
import bluePrintTile from '../assets/blue-print-tile.jpg';
import woodBoard1 from '../assets/wood-board-background.png';
import woodBoard2 from '../assets/wood-board-background2.jpg';
import wallpaper from '../assets/wallpaper.jpg';

export default function ClashDeck({ cards }) {
  // Default demo cards if none provided
  const defaultCards = [
    { imageSrc: blueKingJumping },
    { imageSrc: kingLaughing },
    { imageSrc: bluePrintTile },
    { imageSrc: woodBoard1 },
    { imageSrc: woodBoard2 },
    { imageSrc: wallpaper },
    { imageSrc: blueKingJumping },
    { imageSrc: kingLaughing },
  ];

  const deckCards = cards || defaultCards;

  return (
    <div 
      className="blueprint-material" 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '1rem',
        padding: '1.5rem',
        minHeight: '400px'
      }}
    >
      {deckCards.map((card, index) => (
        <ClashCard 
          key={index} 
          imageSrc={card.imageSrc} 
          alt={card.alt || `Card ${index + 1}`}
        />
      ))}
    </div>
  );
}

