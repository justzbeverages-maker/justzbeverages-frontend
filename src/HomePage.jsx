import './HomePage.css'
import {Header} from "./Components/Header"
import {HomeDis} from "./HomeDis"
import {FooterHomePage} from "./FooterHomePage"
import {ProductDisplay} from "./ProductDisplay"
import OrangeJuiceCan from "./OrangeJuiceCan"
import {AboutUs} from './AboutUs'
import Paddle from "./Paddle"
import {Explore} from "./Explore.jsx";

export function HomePage({ openMenu , data }){
    const hero=data? data.hero:[];
    if(!hero.length){
        return(
            <div>Loading...</div>
        );
    }
    return(
        <>
        <Header openMenu={openMenu}/>
        <div className="hero-section">
            <picture>
            <source media="(max-width: 799px)" srcSet={hero[1].image} />
            <img src={hero[0].image} alt="Hero image" />
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