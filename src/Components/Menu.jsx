
import './Menu.css'
import { NavLink } from 'react-router';
export function Menu({ isMenuOpen , closeMenu }){
    return(
        <div className={`menu-page ${isMenuOpen===true? "display" : ""}`}>
            <div className="click-area" onClick={closeMenu}></div>
            <div className="menu">
                <NavLink to="/"><div className="menu-heading" onClick={closeMenu}>JUSTZ</div></NavLink>
                <NavLink to="/" onClick={closeMenu}><div>Home</div></NavLink>
                <NavLink to="/contact-us" onClick={closeMenu}><div>Contact Us</div></NavLink>
                <NavLink to="/privacy-policy" onClick={closeMenu}><div>Privacy Policy</div></NavLink>
                <NavLink to="/legal" onClick={closeMenu}><div>Legal</div></NavLink>
                <NavLink to="/termsandcondition" onClick={closeMenu}><div>Terms And Conditions</div></NavLink>
            </div>
        </div>
    );
}