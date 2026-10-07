import './HomePage.css'
import {Header} from "./Components/Header"
import {HomeDis} from "./HomeDis"
import {FooterHomePage} from "./FooterHomePage"
import {ProductDisplay} from "./ProductDisplay"
import {AboutUs} from './AboutUs'
import {Explore} from "./Explore.jsx";
import {useGSAP} from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useEffect, useState} from "react";
import {Seo} from "./Seo";
import {Picture} from "./Picture";
import {getSources} from "./imageUtils";
import {ROUTE_SEO} from "./seoConfig";

const HOME_TITLE = ROUTE_SEO["/"].title;
const HOME_DESCRIPTION = ROUTE_SEO["/"].description;
const HERO_MOBILE_QUERY = "(max-width: 799px)";

// Standard "visually hidden" pattern: readable by search engines and screen readers,
// takes no space and is not painted. Inline so no CSS file is touched.
const VISUALLY_HIDDEN = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
};

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

    const [isMobile,setIsMobile]=useState(()=>
        typeof window!=="undefined" ? window.matchMedia(HERO_MOBILE_QUERY).matches : false
    );
    useEffect(()=>{
        const mql=window.matchMedia(HERO_MOBILE_QUERY);
        const handleChange=(e)=>setIsMobile(e.matches);
        mql.addEventListener("change",handleChange);
        return()=>mql.removeEventListener("change",handleChange);
    },[]);

    const hero=data? data.hero:[];
    const ready=hero.length>0;
    // The mobile hero image comes from the backend (hero[1], falling back to hero[0] instead of crashing).
    const mobileHeroSrc=ready ? (hero[1]?.image ?? hero[0]?.image) : null;

    // Mobile needs the backend's hero image, so it keeps the loading screen until the data arrives.
    // Desktop uses a static hero image, so it no longer has to wait for the API (this is the LCP element).
    if(isMobile && !ready){
        return(
            <>
                <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" />
                <div className="loading"><Picture src="/LOADINGPAGE.png" alt="JustZ" loading="eager" fetchPriority="high" decoding="async"/></div>
            </>
        );
    }

    const mobileSources = mobileHeroSrc ? (
        <>
            {getSources(mobileHeroSrc, HERO_MOBILE_QUERY).map((s)=>(
                <source key={s.type} media={s.media} type={s.type} srcSet={s.srcSet}/>
            ))}
            <source media={HERO_MOBILE_QUERY} srcSet={mobileHeroSrc}/>
        </>
    ) : null;

    return(
        <>
            <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" />
            <Header openMenu={openMenu}/>
            <div className="hero-section" id="home">
                <h1 style={VISUALLY_HIDDEN}>JustZ | Premium Synbiotic Sparkling Beverages</h1>
                <Picture
                    src="/example2.png"
                    alt="JustZ premium sparkling beverages"
                    before={mobileSources}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
            </div>
            {ready && (
                <>
                    <HomeDis data={data}/>
                    <Explore />
                    <AboutUs/>
                    <ProductDisplay data={data} />
                    <FooterHomePage/>
                </>
            )}
        </>
    );
}
