import './Legal.css';
import {HeaderOther} from './Components/HeaderOther';
import {Footer} from './Footer';

export function PrivacyPolicy({openMenu}) {
  return (
    <>
      <HeaderOther openMenu={openMenu} />
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        
        <h2>1. Information We Collect</h2>
        <p>We collect: (a) Personal Information — name, email address, phone number, delivery address, and payment details when you make a purchase or create an account. (b) Usage Data — IP address, browser type, pages visited, time spent on Site, and referral source, collected automatically via cookies and analytics tools. (c) Communications — any messages, queries, or feedback you send us.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to: process and fulfil your orders; send order confirmations and shipping updates; respond to customer service queries; improve our website and product offerings; send marketing communications (with your consent); comply with legal obligations; and prevent fraud and ensure Site security.</p>
        
        <h2>3. Legal Basis for Processing</h2>
        <p>We process your data on the following bases: performance of a contract (processing your order); legitimate interests (site analytics, fraud prevention, product improvement); consent (marketing communications — you may withdraw consent at any time); and compliance with legal obligations (tax records, dispute resolution).</p>
        
        <h2>4. Sharing of Information</h2>
        <p>We do not sell your personal data to third parties. We may share data with: payment gateway providers (Razorpay, PayU) for transaction processing; logistics partners (Delhivery, Shiprocket) for delivery; email and CRM platforms (Klaviyo, Mailchimp) for communications; analytics providers (Google Analytics) for Site performance insights. All third parties are contractually required to maintain data confidentiality.</p>
        
        <h2>5. Cookies</h2>
        <p>Our Site uses cookies to enhance your browsing experience, analyse traffic, and personalise content. You can control cookie preferences via your browser settings. Disabling cookies may affect certain Site functionality. We use both session cookies (expire when you close the browser) and persistent cookies (remain for a set period).</p>
        
        <h2>6. Data Retention</h2>
        <p>We retain personal data for as long as necessary to provide our services and comply with legal obligations. Order data is retained for a minimum of 7 years for tax and accounting purposes. You may request deletion of your account data at any time (subject to legal retention requirements) by emailing privacy@justz.in.</p>
        
        <h2>7. Your Rights</h2>
        <p>Under applicable Indian data protection law and global best practices, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data (where legally permitted); opt out of marketing communications at any time (via the unsubscribe link in emails); and lodge a complaint with the relevant data protection authority.</p>
        
        <h2>8. Data Security</h2>
        <p>We implement industry-standard security measures including SSL/TLS encryption, secure server infrastructure, and restricted access controls to protect your personal information. However, no method of internet transmission or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
        
        <h2>9. Children's Privacy</h2>
        <p>The Site is not directed at children under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a child has provided us with personal data, we will promptly delete it.</p>
        
        <h2>10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Material changes will be communicated via a notice on the Site or email. Continued use of the Site after such updates constitutes your acceptance of the revised policy.</p>
        
        <h2>11. Contact for Privacy Queries</h2>
        <p>For any privacy-related questions, data requests, or complaints, contact our Grievance Officer: Name: [Grievance Officer Name], Email: grievance@justz.in, Address: [Registered Office], New Delhi 110001, India. We aim to respond to all queries within 30 days.</p>
      </div>
      <Footer />
    </>
  );
}