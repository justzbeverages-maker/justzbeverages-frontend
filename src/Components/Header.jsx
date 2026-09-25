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
                .from(".nav-cen a",{
                    y:-40,
                    duration:1,
                    opacity:0,
                    stagger:{
                        amount:.5,
                    }
                })
            gsap.from
        })
    return( 
    <div className="navBar">
        <div className="logo"><NavLink to="/" className="navlink">JUSTZ</NavLink></div>
        <div className="nav-cen">
            <a href="#home" className="links">Home</a>
            <a href="#Explore" className="links">Explore</a>
            <a href="#about-us" className="links">About Us</a>
            <a href="#products" className="links">Products</a>
            <a href="#Contact-us" className="links">Contact Us</a>
        </div>
        <div className="nav" onClick={openMenu}>
            <i className="ri-menu-line"></i>
        </div>
    </div>
    );
}