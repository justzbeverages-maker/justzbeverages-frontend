import { NavLink } from 'react-router'; /* Typically imported from react-router-dom */
import './FooterHomePage.css'

export function FooterHomePage() {
  return (
    <footer className="footer-home-page">
      <div className="social-media">
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
          <img className="otherFooter" src="/facebook.png" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          <img className="otherFooter" src="/instagram-circle.png" alt="Instagram" />
        </a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          <img className="otherFooter" src="/linkedin.png" alt="LinkedIn" />
        </a>
      </div>
      
      <div className="policy">
        <NavLink to="/contact-us">Contact Us</NavLink>
        <NavLink to="/privacy-policy">Privacy Policy</NavLink>
        <NavLink to="/legal">Legal</NavLink>
        <NavLink to="/termsandcondition">Terms And Conditions</NavLink>
      </div>
      <div className="developer">Proudly Created By RONIT SOLANKI</div>
    </footer>
  );
}