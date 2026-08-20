import './AboutUs.css'

export function AboutUs() {
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