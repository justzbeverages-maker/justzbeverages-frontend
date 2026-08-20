import './Legal.css'
import {HeaderOther} from './Components/HeaderOther'
import {Footer} from './Footer'

export function Legal({openMenu}) {
  return (
    <>
      <HeaderOther openMenu={openMenu} />
      <div className="legal-container">
        <h1>Legal</h1>
        
        <h2>FSSAI Compliance Statement</h2>
        <p>Justz Beverages Pvt. Ltd. is licensed under the Food Safety and Standards Authority of India (FSSAI). FSSAI License No.: XXXXXXXXXXXXXXXXXX. All Justz products are manufactured in FSSAI-compliant facilities and comply with the Food Safety and Standards Act, 2006 and associated regulations.</p>
        
        <h2>Health Claim Disclaimer</h2>
        <p>"Prebiotic fiber has been linked to gut microbiome support in multiple peer-reviewed studies. Justz products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Consult your physician if you have a pre-existing digestive or medical condition."</p>
        
        <h2>Stevia / Sweetener Disclosure</h2>
        <p>Justz products are sweetened with steviol glycosides (stevia leaf extract), a natural, zero-calorie sweetener approved by FSSAI. Products contain no added refined sugar, HFCS, aspartame, or artificial sweeteners.</p>
        
        <h2>Allergen Statement</h2>
        <p>Justz products do not contain gluten, dairy, soy, or tree nuts as intentional ingredients. However, products are manufactured in a facility that may process these allergens. Individuals with severe allergies should exercise caution.</p>
        
        <h2>Footer Legal Line</h2>
        <p>© 2026 Justz Beverages Pvt. Ltd. All rights reserved. | FSSAI Lic. No. XXXXXXXXXXXXXXXXXX | Terms & Conditions | Privacy Policy | Designed & Developed in India</p>
        
        <h2>Social / Marketing Disclaimer</h2>
        <p>All social media content, influencer posts, and marketing materials featuring Justz products must include the hashtag #JustzHideNothing and must not make unsubstantiated health claims. Paid partnerships must be disclosed with #Ad or #Collab per ASCI guidelines.</p>
      </div>
      <Footer />
    </>
  );
}