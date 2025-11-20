import { Outlet } from 'react-router-dom';
import DecksNav from './DecksNav';

export default function Decks() {
  return (
    <div
      style={{
        padding: '2rem',
        paddingTop: '6rem', // Account for fixed navbar
        paddingBottom: '10rem', // Account for bottom navigation
        minHeight: 'calc(100vh - 7rem)', // Account for #root padding (5rem top + 2rem bottom)
        boxSizing: 'border-box',
        overflow: 'visible',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'visible',
        }}
      >
        <Outlet />
      </div>
      <DecksNav />
    </div>
  );
}

