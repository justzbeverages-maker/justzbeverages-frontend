import './HomePage.css'
import {Header} from "./Components/Header"
import {HomeDis} from "./HomeDis"
import {FooterHomePage} from "./FooterHomePage"
import {ProductDisplay} from "./ProductDisplay"
import OrangeJuiceCan from "./OrangeJuiceCan"
import {AboutUs} from './AboutUs'
import Paddle from "./Paddle"
import {Explore} from "./Explore.jsx";
import {useGSAP} from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";

export function HomePage({ openMenu , data }){
    useGSAP(()=>{

        ScrollTrigger.create({
            trigger:".Explore",
            duration:1,
            start:"190% top",
            onEnter: () => document.querySelector(".navBar").classList.add("nav-blur"),
            onLeaveBack: () => document.querySelector(".navBar").classList.remove("nav-blur"),
        })
    })
    const hero=data? data.hero:[];
    if(!hero.length){
        return(
            <div>Loading...</div>
        );
    }
    return(
        <>
        <Header openMenu={openMenu}/>
        <div className="hero-section" id="home">
            <picture>
            <source media="(max-width: 799px)" srcSet={hero[1].image} />
            <img src="/example2.png" alt="Hero image" />
        </picture>
            {/* <OrangeJuiceCan/> */}
        </div>
        <HomeDis data={data}/>
        <Explore />
        <AboutUs/>
        <ProductDisplay data={data} />
        <FooterHomePage/>
        {/* <Paddle/> */}
        </>
    );
}