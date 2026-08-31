
import './Menu.css'
import { NavLink } from 'react-router';
import {useGSAP} from "@gsap/react";
import gsap from 'gsap';

export function Menu({ isMenuOpen , closeMenu }){
    useGSAP(()=>{
        if(isMenuOpen){
            const t1=gsap.timeline();
            t1.from(".menu-page",{
                x:200,
                opacity:0,
                duration:.3,
            }).from(".menu *",{
                opacity:0,
                stagger:.1,
            })
        }
    },[isMenuOpen]);
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