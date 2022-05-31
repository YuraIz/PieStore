import React, { useState, Component } from "react";

import "./style/App.css";
import "./style/CakeCard.scss";
import "./style/Cart.scss";

// import CakesService from "./CakesService";

import { CakeTable } from "./components/CakeTable";
import { CartDetail } from "./components/CartDetail";

// import CartService from "./CartService";
import { PopUp } from "./PopUp";
export const CartContext = React.createContext(0);
// export const cakesService = new CakesService();

const NavBar = ({ children }) => <ul className="NavBar">{children}</ul>;

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
                    <CartDetail
                        sharedItem={itemsCount}
                        setCount={setItemsCount}
                    />
                </PopUp>
            ) : null}
            <div>
                <NavBar>
                    <li>
                        <p>PieStore</p>
                    </li>
                    <button className="btn" onClick={() => setShowCart(true)}>
                        {`Cart: ${itemsCount}`}
                    </button>
                </NavBar>
                <CakeTable callback={addItem} />
            </div>
        </div>
    );
};

export default App;
