import './ProductDisplay.css'
 import {ProductGrid} from './ProductGrid'
export function ProductDisplay({data}){
    return(<>
            <div className="nutrition">Click The Drink To Reveal Its Truth</div>
            <div className="display-product">
            <ProductGrid data={data}/>
        </div>
            </>
        
    );
}