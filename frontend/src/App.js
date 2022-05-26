import React, { useState, Component } from "react";

import "./style/App.css";
import "./style/CakeCard.scss";
import "./style/Cart.scss";

// import CakesService from "./CakesService";

import { CakeTable } from "./components/CakeTable";
import { CartDetail } from "./components/CartDetail2";

// import CartService from "./CartService";
import { PopUp } from "./PopUp";
export const CartContext = React.createContext(0);
// export const cakesService = new CakesService();

const App = () => {
    const [itemsCount, setItemsCount] = useState(0);
    const addItem = () => {
        setItemsCount(itemsCount + 1);
    };

    const [showCart, setShowCart] = useState(false);
    return (
        <div>
            {showCart ? (
                <PopUp toggle={() => setShowCart(false)}>
                    <CartDetail sharedItem={itemsCount} />
                </PopUp>
            ) : null}
            <div>
                <button className="btn" onClick={() => setShowCart(true)}>
                    {`Cart: ${itemsCount}`}
                </button>
                <CakeTable callback={addItem} />
            </div>
        </div>
    );
};

export default App;
