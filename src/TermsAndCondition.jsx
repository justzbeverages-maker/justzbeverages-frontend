import './Legal.css';
import {HeaderOther} from './Components/HeaderOther';
import {Footer} from './Footer';

export function TermsAndCondition({openMenu}) {
  return (
    <>
      <HeaderOther openMenu={openMenu} />
      <div className="legal-container">
        <h1>Terms and Conditions</h1>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using <a href="https://www.justz.in">www.justz.in</a> ("the Site") or purchasing any Justz product, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

        <h2>2. Eligibility</h2>
        <p>You must be at least 18 years of age to place an order on the Site. By placing an order, you confirm that you are at least 18 years old. Justz Beverages Pvt. Ltd. reserves the right to refuse service to anyone at any time.</p>

        <h2>3. Products and Pricing</h2>
        <p>All prices displayed on the Site are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Justz reserves the right to modify product prices at any time without prior notice. Prices at the time of order confirmation are the prices that apply to that order. We do not guarantee product availability and reserve the right to discontinue any product.</p>

        <h2>4. Orders and Payment</h2>
        <p>Orders placed on the Site are subject to acceptance and availability. We accept payment via UPI, credit/debit cards, net banking, and other methods made available at checkout. Payment is processed at the time of order confirmation. In the event of a payment failure, your order will not be confirmed. All transactions are secured via SSL encryption.</p>

        <h2>5. Shipping and Delivery</h2>
        <p>We currently ship within India. Estimated delivery timelines are 3–7 business days, subject to location and courier availability. Justz is not responsible for delays caused by courier partners, weather conditions, or circumstances beyond our control. Risk of loss passes to the customer upon dispatch of the order.</p>

        <h2>6. Returns and Refunds</h2>
        <p>Due to the perishable nature of food and beverage products, we do not accept returns unless the product received is damaged, defective, or incorrect. Claims for damaged or incorrect products must be raised within 48 hours of delivery with photographic proof sent to support@justz.in. Approved refunds will be processed to the original payment method within 5–7 business days.</p>

        <h2>7. Health Disclaimer</h2>
        <p>Justz products are food and beverage items, not medicines. The information provided on the Site regarding health benefits (prebiotic fiber, gut health) is for informational purposes only and is not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before making significant dietary changes, especially if you have a medical condition or are pregnant or breastfeeding.</p>

        <h2>8. Intellectual Property</h2>
        <p>All content on the Site, including but not limited to text, graphics, logos, product images, and brand assets, is the exclusive property of Justz Beverages Pvt. Ltd. and is protected under applicable Indian intellectual property laws. Unauthorized reproduction, distribution, or use of any content is strictly prohibited.</p>

        <h2>9. User Conduct</h2>
        <p>You agree not to use the Site for any unlawful purpose, to post or transmit any harmful or offensive content, to impersonate any person or entity, or to engage in any activity that could disrupt or interfere with the proper functioning of the Site.</p>

        <h2>10. Third-Party Links</h2>
        <p>The Site may contain links to third-party websites. These links are provided for convenience only. Justz has no control over and accepts no responsibility for the content or practices of any third-party sites. Accessing any linked site is at your own risk.</p>

        <h2>11. Limitation of Liability</h2>
        <p>To the fullest extent permitted by applicable law, Justz Beverages Pvt. Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or purchase of our products. Our total liability in any matter shall not exceed the amount paid by you for the specific product or order in question.</p>

        <h2>12. Governing Law</h2>
        <p>These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.</p>

        <h2>13. Amendments</h2>
        <p>Justz reserves the right to update or modify these Terms at any time. Continued use of the Site after such changes constitutes your acceptance of the revised Terms. We recommend reviewing this page periodically.</p>

        <h2>14. Contact for Terms Queries</h2>
        <p>For any questions regarding these Terms and Conditions, please write to: <a href="mailto:legal@justz.in">legal@justz.in</a></p>
      </div>
      <Footer />
    </>
  );
}