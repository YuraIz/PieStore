import React, { useState, Component } from "react";

import "./style/App.css";
import "./style/CakeCard.scss";
import "./style/Cart.scss";
import "./style/OrderItem.scss";

// import CakesService from "./CakesService";

import { CakeTable } from "./components/CakeTable";
import { CartDetail } from "./components/CartDetail";
import { OrderDetail } from "./components/OrderDetail";

import { cartService } from "./components/shared";

// import CartService from "./CartService";
import { PopUp } from "./PopUp";
import { useEffect } from "react";
export const CartContext = React.createContext(0);
// export const cakesService = new CakesService();

const NavBar = ({ children }) => <ul className="NavBar">{children}</ul>;

const App = () => {
    const [itemsCount, setItemsCount] = useState(0);
    const addItem = () => {
        setItemsCount(itemsCount + 1);
    };

    const [showCart, setShowCart] = useState(false);

    const [showOrder, setShowOrder] = useState(false);

    useEffect(() => {
        cartService.getCart().then((result) => {
            if (Math.ceil(result.timer) !== 0) setShowOrder(true);
        });
    }, []);

    if (showOrder)
        return <OrderDetail hideCallback={() => setShowOrder(false)} />;

    return (
        <div>
            {showCart ? (
                <PopUp toggle={() => setShowCart(false)}>
                    <CartDetail showOrderCallback={() => setShowOrder(true)} />
                </PopUp>
            ) : null}
            <div>
                <NavBar>
                    <li>
                        <p>PieStore</p>
                    </li>
                    <button className="btn" onClick={() => setShowCart(true)}>
                        Корзина
                    </button>
                </NavBar>
                <CakeTable callback={addItem} />
            </div>
        </div>
    );
};

export default App;
