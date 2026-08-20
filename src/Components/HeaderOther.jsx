import "./HeaderOther.css"
import {NavLink} from 'react-router'
export function HeaderOther({openMenu}){
    return(
         <div className="navBar color">
        <div className="logo color"><NavLink to="/" className="navlink">JUSTZ</NavLink></div>
        <div className="nav-cen color">Hide Nothing. Feel Everything</div>
        <div className="nav color" onClick={openMenu} >
            =
        </div>
    </div>
    );
}