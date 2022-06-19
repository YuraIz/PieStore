import React, { useEffect, useState, useLayoutEffect } from "react";
import { cartService } from "./shared";
import { cakesService } from "./shared";

const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
};

function Counter({ count, setCount }) {
    const dec = () => setCount(count - 1);
    const inc = () => setCount(count + 1);

    return (
        <div className="Counter">
            <button onClick={dec}>-</button>
            <p>{count}</p>
            <button onClick={inc}>+</button>
        </div>
    );
}

function CartItem({ item }) {
    const [cake, setCake] = useState({});

    const [count, setCount] = useState(item.quantity);
    const [price, setPrice] = useState(item.total_price);

    useEffect(() => {
        cakesService.getCake(item.item).then((result) => setCake(result));
    }, []);

    const setItemCount = (newCount) => {
        cartService.updateCart(cake, newCount).then((item) => {
            setPrice(item.total_price);
        });
        setCount(newCount);
    };

    if (count === 0) return null;
    return (
        <table className="CartItem">
            <tbody>
                <tr>
                    <td>
                        <img src={cake.image} alt={cake.name} />
                    </td>
                    <div>
                        <td>
                            <h5>{cake.name}</h5>
                        </td>
                    </div>
                    <div>
                        <td>{cake.description}</td>
                    </div>
                </tr>
                <tr>
                    <td>${price}</td>
                    <td>
                        <Counter count={count} setCount={setItemCount} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export function CartDetail({ showOrderCallback }) {
    const [info, setInfo] = useState([]);

    useEffect(() => {
        cartService.getCart().then((result) => {
            setInfo(result.data);
            console.log(JSON.stringify(result));
        });
    }, []);

    return (
        <div>
            {info?.map((el, i) => (
                <CartItem key={generateKey(i)} item={el} />
            ))}
            {/* <OrderInfo /> */}
            {info?.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <button className="btn" onClick={showOrderCallback}>
                    Заказать
                </button>
            )}
        </div>
    );
}
