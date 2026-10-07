import { Routes , Route , useLocation } from 'react-router';
import { useState , useEffect , lazy , Suspense } from "react"
import {HomePage} from './HomePage'
import {PrivacyPolicy} from './PrivacyPolicy'
import {ContactUs} from './ContactUs'
import {Menu} from './Components/Menu'
import {TermsAndCondition} from './TermsAndCondition'
import {Legal} from './Legal';
import {NotFound} from './NotFound'
import {RouteSeo} from './Seo'
import axios from 'axios'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './App.css'

// The admin panel is only needed by the site owner: keep it out of the public bundle.
const AdminPanel = lazy(() => import('./AdminPanel').then((m) => ({ default: m.AdminPanel })));

// SplitText was registered here but is not used anywhere, so it is no longer imported.
gsap.registerPlugin(ScrollTrigger);
function App() {
  const [data,setData]=useState(null);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  // Only the homepage uses this data, so other routes (privacy, contact, ...) no longer wait on it.
  useEffect(()=>{
    if(!isHome || data) return;
    let cancelled=false;
    async function fetchData(){
      try{
        const response= await axios.get("https://justzbeverages.onrender.com/HomePage");
        if(!cancelled) setData(response.data);
      }catch(err){
        console.error("Could not load homepage data", err);
      }
    }
    fetchData();
    return ()=>{ cancelled=true; };
  },[isHome,data]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  return (
    <>
    <Menu isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
    <Routes>
      <Route path="/" element={<HomePage  openMenu={openMenu} data={data}/>}/>
      <Route path="/privacy-policy" element={<PrivacyPolicy openMenu={openMenu}/>}/>
      <Route path="/contact-us" element={<ContactUs openMenu={openMenu}/>}/>
      <Route path='/termsandcondition' element={<TermsAndCondition openMenu={openMenu}/>}/>
      <Route path='/legal' element={<Legal openMenu={openMenu}/>}/>
      <Route path="/admin" element={<><RouteSeo path="/admin"/><Suspense fallback={null}><AdminPanel/></Suspense></>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    </>
  );
}

export default App
