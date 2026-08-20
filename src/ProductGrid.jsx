import './ProductGrid.css'
import {useState, useEffect, useRef} from "react"

const MOBILE_QUERY = "(max-width: 800px)";
const SWIPE_THRESHOLD = 50;

function ProductCard({product}){
    const[click,setClick]=useState(false);
    return(<>
<div className={`element ${click===1 ? "elementOnClick" : "" }`} onClick={()=>{
                        if(click==1)
                            setClick(0);
                        else
                            setClick(1);
                     }}><img className={`front ${click===1 ? "frontOnClick" : ""}`} src={product.front_image}></img>
            <img className={`back ${click===1 ? "backOnClick" : ""}`} src={product.nutrition}></img>
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
                        <ProductCard product={product} key={product.id}/>
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