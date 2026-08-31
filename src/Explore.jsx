import './Explore.css'
import { useRef } from 'react'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

export function Explore() {
    const containerRef = useRef(null)

    useGSAP(() => {
        const panels = gsap.utils.toArray(".explore", containerRef.current)

        const horizontalScroll = gsap.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: true,
                // markers:true,
                start: "top 6%",
                end: () => "+=" + containerRef.current.offsetWidth * (panels.length - 1) ,
                invalidateOnRefresh: true,
            },
        })
        gsap.from(panels[0],{
            yPercent:30,
            duration:1,
            delay:0,
            opacity:0,
            scrollTrigger: {
                trigger: panels[0],
                // markers:true,
            }
        });
        const img1=panels[1].querySelector("img");
        gsap.from(img1,{
            xPercent:-50,
            opacity:0,
            duration:1,
            scrollTrigger: {
                trigger: panels[1],
                start:"left center",
                containerAnimation:horizontalScroll,
                toggleActions:"play none none reverse",
                // markers:true,
            }
        })

        const img2=panels[2].querySelector("img");
        gsap.from(img2,{
            xPercent:-100,
            opacity:0,
            duration:1,
            scrollTrigger: {
                trigger: panels[2],
                start:"left center",
                containerAnimation:horizontalScroll,
                toggleActions:"play none none reverse",
                // markers:true,
            }
        })

        const img3=panels[3].querySelector("img");
        gsap.from(img3,{
            xPercent:-100,
            opacity:0,
            duration:1,
            scrollTrigger: {
                trigger: panels[3],
                start:"left center",
                containerAnimation:horizontalScroll,
                toggleActions:"play none none reverse",
                // markers:true,
            }
        })

        return () => {
            horizontalScroll.scrollTrigger?.kill()
        }
    }, { scope: containerRef })

    return (
        <div className="Explore desktop" ref={containerRef}>
            <div className="justz explore">Explore<br/>Justz</div>

            <div className="explore product" id="first">
                <div className="product-container">
                    <h2>ORANGE JUICE</h2>
                    <div className="product-data">
                        <div className="product-desc">
                            <h4>Description</h4>
                            <p>Fresh apple character meets delicate bubbles for a clean, refreshing sip. Bright, crisp, and effortlessly easy to drink.
                                Crisp Apple Extract • Prebiotic Fiber • Natural Flavors • Stevia</p>
                        </div>
                        <div className="product-image">
                            <img src="/crisp_apple_front_without_background.png"/>
                        </div>
                        <div className="product-benefits">
                            <h4>Health Benefit</h4>
                            <p>Fresh apple character meets delicate bubbles for a clean, refreshing sip. Bright, crisp, and effortlessly easy to drink.
                                Crisp Apple Extract • Prebiotic Fiber • Natural Flavors • Stevia
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="explore product" id="second">
                <div className="product-container">
                    <h2>WATERMELON LIME</h2>
                    <div className="product-data">
                        <div className="product-desc">
                            <h4>Description</h4>
                            <p>A crisp burst of watermelon with a bright touch of lime. Lightly sparkling, naturally refreshing, and made to keep things simple.
                                Watermelon Extract • Lime Oil • Prebiotic Fiber • Natural Flavors • Stevia</p>
                        </div>
                        <div className="product-image">
                            <img src="/watermelon_lime_front_removebg.png"/>
                        </div>
                        <div className="product-benefits">
                            <h4>Health Benefit</h4>
                            <p>A crisp burst of watermelon with a bright touch of lime. Lightly sparkling, naturally refreshing, and made to keep things simple.
                                Watermelon Extract • Lime Oil • Prebiotic Fiber • Natural Flavors • Stevia
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="explore product" id="third">
                <div className="product-container">
                    <h2>CLASSIC ILON</h2>
                    <div className="product-data">
                        <div className="product-desc">
                            <h4>Description</h4>
                            <p>A smooth, fruity classic with a subtle lime lift. Refreshingly sparkling with a rich grap character and a clean finish.
                                Classic Ilon Extract • Lime Oil • Prebiotic Fiber • Natural Flavors • Stevia.</p>
                        </div>
                        <div className="product-image">
                            <img src="/classic_ilon_front_removebg.png"/>
                        </div>
                        <div className="product-benefits">
                            <h4>Health Benefit</h4>
                            <p>A smooth, fruity classic with a subtle lime lift. Refreshingly sparkling with a rich grap character and a clean finish.
                                Classic Ilon Extract • Lime Oil • Prebiotic Fiber • Natural Flavors • Stevia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}