import './AboutUs.css'
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

export function AboutUs() {
    useGSAP(()=>{
        const t2=gsap.timeline({
            scrollTrigger:{
                trigger:".about-us-container",
                start:"top 35%"
            }
        });
        t2.from(".video",{
            currentTime:0,
            delay:0.5,
            opacity:0,
            ease:"power2.out",
        },0).from(".about-us-content *",{
            x:200,
            duration:1,
            opacity:0,
            stagger:.2,
        },0);
    },[])
  return (
    <div className="about-us-container">
      <div className="video-container">
        <video 
          className="video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/produxcts01.mp4" type="video/mp4"/>
        </video>
      </div>
      
      <div className="about-us">
        <div className="about-us-content">
          <h2>We Believe in Hiding Nothing.</h2>
          <p>At Justz, we got tired of beverage labels that looked like chemistry experiments. We believe that what you put into your body should be simple, natural, and completely transparent.</p>
          <p>That is why our motto is <strong>Hide Nothing</strong>. We don't hide behind artificial sweeteners, synthetic colors, or unpronounceable preservatives. Instead, we craft our sparkling waters using real fruit extracts, gut-friendly prebiotic fiber, and natural stevia.</p>
          <p>Zero added sugar. Zero compromises. Just refreshing, functional hydration that makes you feel as good as it tastes. We hide nothing, so you can feel everything.</p>
        </div>
      </div>
    </div>
  );
}