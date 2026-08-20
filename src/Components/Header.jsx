import { NavLink } from "react-router";
import "./Header.css"
export function Header({ openMenu }){

    return( 
    <div className="navBar">
        <div className="logo"><NavLink to="/" className="navlink">JUSTZ</NavLink></div>
        <div className="nav-cen">Hide Nothing. Question Everything</div>
        <div className="nav" onClick={openMenu} >
            =
        </div>
    </div>
    );
}