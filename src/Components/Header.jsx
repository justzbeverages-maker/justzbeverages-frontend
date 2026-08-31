import { NavLink } from "react-router";
import "./Header.css"
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
export function Header({ openMenu }){
        useGSAP(()=>{
            const t1=gsap.timeline();
            t1.from(".navBar",{
                y:-40,
                duration:.77,
                opacity:0,
            })
                .from(".logo",{
                    y:-40,
                    duration:.5,
                    opacity:0,
                })
                .from(".nav",{
                    y:-40,
                    duration:.5,
                    opacity:0,
                })
                .from(".nav-cen h4",{
                    y:-40,
                    duration:1,
                    opacity:0,
                })
        })
    return( 
    <div className="navBar">
        <div className="logo"><NavLink to="/" className="navlink">JUSTZ</NavLink></div>
        <div className="nav-cen"><h4>Hide Nothing. Question Everything</h4></div>
        <div className="nav" onClick={openMenu}>
            <i className="ri-menu-line"></i>
        </div>
    </div>
    );
}