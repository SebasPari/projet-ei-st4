import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const getLinkClassName = ({ isActive }) => {
    if (isActive) {
      return 'Header-link Header-link-active';
    }

    return 'Header-link';
  };

  return (
    <header className="Header-container">
      <NavLink className="Header-brand" to="/">
        MovieMatch
      </NavLink>

      <nav className="Header-nav" aria-label="Navigation principale">
        <NavLink className={getLinkClassName} to="/">
          Accueil
        </NavLink>
        <NavLink className={getLinkClassName} to="/recommendations">
          Recommandations
        </NavLink>
        <NavLink className={getLinkClassName} to="/users">
          Utilisateurs
        </NavLink>
        <NavLink className={getLinkClassName} to="/counter">
          Compteur
        </NavLink>
        <NavLink className={getLinkClassName} to="/about">
          A propos
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
