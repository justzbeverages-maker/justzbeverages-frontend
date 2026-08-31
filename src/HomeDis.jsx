import "./HomeDis.css";
import { useEffect, useState } from "react";

export function HomeDis({ data }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHover, setIsHover] = useState(false);
    const products = data ? data.products : [];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (products.length === 0 || isHover) {
                return;
            }
            setCurrentIndex((prevIndex) => {
                if (prevIndex === products.length - 1) {
                    return 0;
                } else {
                    return prevIndex + 1;
                }
            });
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [currentIndex, isHover, products.length]);

    if (!products.length) {
        return <div className="drink-grid">Loading products...</div>;
    }

    return (
        <div className="drink-grid mobile">
            <div className="drink-discription">
                <h2 className="description-header">{products[currentIndex].name}</h2>
                <p className="description-body">{products[currentIndex].des}</p>
            </div>
            
            <div className="drink-images">
                {products.map((drink, index) => {
                    return (
                        <img 
                            key={drink.id} 
                            onMouseEnter={() => setIsHover(true)}
                            onMouseLeave={() => setIsHover(false)} 
                            className={currentIndex === index ? "display-product" : "no-display-product"}
                            src={drink.front_image}
                            alt={`${drink.name} packaging`} 
                        />
                    );
                })}
            </div>
        </div>
    );
}