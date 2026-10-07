import './ProductGrid.css'
import {useState, useEffect, useRef} from "react"
import {Picture} from "./Picture"

const MOBILE_QUERY = "(max-width: 800px)";
const SWIPE_THRESHOLD = 50;

// `focusable` is false on the mobile carousel: focusing an off-screen slide inside an
// overflow:hidden track would make the browser scroll the track and break the translateX state.
function ProductCard({product, focusable}){
    const[click,setClick]=useState(false);
    const toggle=()=>{
        if(click==1)
            setClick(0);
        else
            setClick(1);
    };
    return(<>
            <div className={`element ${click===1 ? "elementOnClick" : "" }`}
                 onClick={toggle}
                 role="button"
                 tabIndex={focusable ? 0 : undefined}
                 aria-pressed={click===1}
                 aria-label={`${product.name} – ${click===1 ? "show product front" : "show nutrition information"}`}
                 onKeyDown={(e)=>{
                     if(e.key==="Enter" || e.key===" "){
                         e.preventDefault();
                         toggle();
                     }
                 }}
            ><Picture className={`front ${click===1 ? "frontOnClick" : ""}`} src={product.front_image} alt={`${product.name} by JustZ`} loading="lazy" decoding="async"/>
                <Picture className={`back ${click===1 ? "backOnClick" : ""}`} src={product.nutrition} alt={`${product.name} nutrition information label`} loading="lazy" decoding="async"/>
            </div>
        </>
    );
}
export function ProductGrid({data}){
    const products=data?data.products:[];
    const [currentIndex,setCurrentIndex]=useState(0);
    // lazy initializer: computed once on mount, not via a setState call inside an effect
    const [isMobile,setIsMobile]=useState(()=>
        typeof window!=="undefined" ? window.matchMedia(MOBILE_QUERY).matches : false
    );
    const touchStartX=useRef(0);
    const touchEndX=useRef(0);

    useEffect(()=>{
        const mql=window.matchMedia(MOBILE_QUERY);
        // setIsMobile is only called here, inside the callback that responds
        // to the external "change" event - never synchronously in the effect body
        const handleChange=(e)=>setIsMobile(e.matches);
        mql.addEventListener("change",handleChange);
        return()=>mql.removeEventListener("change",handleChange);
    },[]);

    if (!products.length) {
        return <div className="product-grid" id="product-grid">Loading products...</div>;
    }

    // derived value instead of an effect that calls setCurrentIndex(0):
    // if products shrinks, clamp the index for rendering without a render-triggering effect
    const safeIndex=Math.min(currentIndex,products.length-1);

    const goToNext=()=>{
        setCurrentIndex((prev)=> prev===products.length-1 ? 0 : prev+1);
    };
    const goToPrev=()=>{
        setCurrentIndex((prev)=> prev===0 ? products.length-1 : prev-1);
    };

    const handleTouchStart=(e)=>{
        touchStartX.current=e.touches[0].clientX;
        touchEndX.current=e.touches[0].clientX;
    };
    const handleTouchMove=(e)=>{
        touchEndX.current=e.touches[0].clientX;
    };
    const handleTouchEnd=()=>{
        const diff=touchStartX.current-touchEndX.current;
        if(Math.abs(diff)>SWIPE_THRESHOLD){
            if(diff>0){
                goToNext();
            }
            else{
                goToPrev();
            }
        }
        touchStartX.current=0;
        touchEndX.current=0;
    };

    return(
        <div className="product-grid" id="product-grid"
             onTouchStart={isMobile ? handleTouchStart : undefined}
             onTouchMove={isMobile ? handleTouchMove : undefined}
             onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
            <div className="product-track"
                 style={isMobile ? {transform:`translateX(-${safeIndex*100}%)`} : undefined}
            >
                {products.map((product)=>{
                    return(
                        <ProductCard product={product} key={product.id} focusable={!isMobile}/>
                    );
                })}
            </div>
            {isMobile &&
                <div className="product-dots">
                    {products.map((product,index)=>(
                        <span key={product.id}
                              className={`dot ${index===safeIndex ? "dot-active" : ""}`}
                              onClick={()=>setCurrentIndex(index)}
                        ></span>
                    ))}
                </div>
            }
        </div>
    );
}