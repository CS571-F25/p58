export default function ClashCard({ imageSrc, alt = 'Clash card' }) {
  return (
    <div className="blueprint-material" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <img 
        src={imageSrc} 
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
}

