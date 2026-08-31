import { Routes , Route } from 'react-router';
import { useState , useEffect } from "react"
import {HomePage} from './HomePage' 
import {PrivacyPolicy} from './PrivacyPolicy'
import {ContactUs} from './ContactUs'
import {Menu} from './Components/Menu'
import {TermsAndCondition} from './TermsAndCondition'
import {Legal} from './Legal';
import {AdminPanel} from './AdminPanel'
import axios from 'axios'
import gsap from 'gsap';
import { ScrollTrigger , SplitText } from "gsap/all";
import './App.css'

gsap.registerPlugin(ScrollTrigger,SplitText);
function App() {
  const [data,setData]=useState(null);
  useEffect(()=>{
    async function fetchData(){
       const response= await axios.get("https://justzbeverages.onrender.com/HomePage");
       setData(response.data);
    }
    fetchData();
  },[]);
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
      <Route path="/admin" element={<AdminPanel/>}/>
    </Routes>
    </>
  );
}

export default App
