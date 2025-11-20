import { useDelayedNavigation } from '../contexts/NavigationContext';

export default function DelayedLink({ to, children, ...props }) {
  const { delayedNavigate } = useDelayedNavigation();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    delayedNavigate(to);
    return false;
  };

  // For HashRouter, use # prefix
  const hashPath = to.startsWith('#') ? to : `#${to}`;

  return (
    <a 
      href={hashPath} 
      onClick={handleClick}
      {...props}
      style={{ cursor: 'pointer', textDecoration: 'none', ...props.style }}
    >
      {children}
    </a>
  );
}

