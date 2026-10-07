import './HomePage.css'
import {Header} from "./Components/Header"
import {HomeDis} from "./HomeDis"
import {FooterHomePage} from "./FooterHomePage"
import {ProductDisplay} from "./ProductDisplay"
import {AboutUs} from './AboutUs'
import {Explore} from "./Explore.jsx";
import {useGSAP} from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Seo} from "./Seo";
import {Picture} from "./Picture";
import {getSources} from "./imageUtils";
import {ROUTE_SEO} from "./seoConfig";

const HOME_TITLE = ROUTE_SEO["/"].title;
const HOME_DESCRIPTION = ROUTE_SEO["/"].description;
const HERO_MOBILE_QUERY = "(max-width: 799px)";

// Visually hidden: readable by search engines and screen readers, not painted.
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

export function HomePage({ openMenu, data }){
    useGSAP(()=>{
        ScrollTrigger.create({
            trigger:".Explore",
            duration:1,
            start:"190% top",
            onEnter: () => document.querySelector(".navBar").classList.add("nav-blur"),
            onLeaveBack: () => document.querySelector(".navBar").classList.remove("nav-blur"),
        })
    })

    const hero = data?.hero ?? [];
    const mobileHeroSrc = hero[0]?.image;   // mobile
    const desktopHeroSrc = hero[1]?.image;  // laptop

    // Wait for the backend: both hero images come from it.
    if(!mobileHeroSrc || !desktopHeroSrc){
        return(
            <>
                <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" />
                <div className="loading">
                    <Picture src="/LOADINGPAGE.png" alt="JustZ" loading="eager" fetchPriority="high" decoding="async"/>
                </div>
            </>
        );
    }

    const mobileSources = (
        <>
            {getSources(mobileHeroSrc, HERO_MOBILE_QUERY).map((s)=>(
                <source key={s.type} media={s.media} type={s.type} srcSet={s.srcSet}/>
            ))}
            <source media={HERO_MOBILE_QUERY} srcSet={mobileHeroSrc}/>
        </>
    );

    return(
        <>
            <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" />
            <Header openMenu={openMenu}/>
            <div className="hero-section" id="home">
                <h1 style={VISUALLY_HIDDEN}>JustZ | Premium Synbiotic Sparkling Beverages</h1>
                <Picture
                    src={desktopHeroSrc}
                    alt="JustZ premium sparkling beverages"
                    before={mobileSources}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
            </div>
            <HomeDis data={data}/>
            <Explore />
            <AboutUs/>
            <ProductDisplay data={data} />
            <FooterHomePage/>
        </>
    );
}