
import { NavLink } from 'react-router-dom';
import './NavLinks.css';
import { useAuthContext } from '../../context/auth-context';

const NavLinks = () => {
    const { isLoggedIn, logout } = useAuthContext();
    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>ALL ITEMS</NavLink>
            </li>
            {!isLoggedIn && (
                <li>
                <NavLink to="/auth">AUTHENTICATE</NavLink>
            </li>
            )}

            {isLoggedIn && (
                <li>
                <NavLink to="/items/myitems">MY ITEMS</NavLink>
                </li>
            )}
            {isLoggedIn && (
            <li>
                <NavLink to="/items/new">ADD ITEM</NavLink>
            </li>
            )}
            {isLoggedIn && (
            <li>
                <button onClick={logout}>LOGOUT</button>
            </li>
            )}
        </ul>
    )
};

export default NavLinks;