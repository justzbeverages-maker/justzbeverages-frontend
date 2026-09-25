
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
                duration:.01,
            }).from(".menu *",{
                opacity:0,
                stagger:{
                    amount:.3,
                },
            })
        }
    },[isMenuOpen]);
    return(
        <div className={`menu-page ${isMenuOpen===true? "display" : ""}`}>
            <div className="click-area" onClick={closeMenu}></div>
            <div className="menu">
                {/*<NavLink to="/"><div className="menu-heading" onClick={closeMenu}>JUSTZ</div></NavLink>*/}
                <NavLink to="/" onClick={closeMenu}><div className="testing">Home</div></NavLink>
                <NavLink to="/legal" onClick={closeMenu}><div className="menu-link">Legal</div></NavLink>
                <NavLink to="/contact-us" onClick={closeMenu}><div className="menu-link">Contact Us</div></NavLink>
                <NavLink to="/privacy-policy" onClick={closeMenu}><div className="menu-link">Privacy Policy</div></NavLink>
                <NavLink to="/termsandcondition" onClick={closeMenu}><div className="menu-link">Terms And Conditions</div></NavLink>
            </div>
        </div>
    );
}