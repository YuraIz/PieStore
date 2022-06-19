import React, { useEffect, useState, useLayoutEffect, createRef } from "react";
import { cartService, cakesService } from "./shared";

const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
};

function OrderItem({ item }) {
    const [cake, setCake] = useState({});

    useLayoutEffect(() => {
        cakesService.getCake(item.item).then((result) => setCake(result));
    }, []);

    if (item.quantity === 0) return null;
    return (
        <table className="OrderItem">
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
                    <td>${item.total_price}</td>
                    <td>
                        <p>Количесто: {item.quantity} </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function Countdown({ secs, stop }) {
    const [current, setCurrent] = useState(secs);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(current - 1);
        }, 1000);

        return () => clearInterval(interval);
    });

    if (current <= 0) {
        stop();
        console.log("timer stopped");
        return null;
    } else {
        return (
            <div>
                <p>{current}</p>
            </div>
        );
    }
}

function OrderInfo() {
    const [info, setInfo] = useState([]);
    const [timer, setTimer] = useState(0);

    const [price, setPrice] = useState(0);

    useEffect(() => {
        cartService.getCart().then((result) => {
            setInfo(result.data);
            setTimer(Math.ceil(result.timer));
            console.log(JSON.stringify(result));
            setPrice(
                result.data?.reduce(
                    (partialSum, a) => partialSum + a.total_price,
                    0
                )
            );
        });
    }, []);

    const onOrder = () => {
        cartService.deleteItems().then((_) => {
            cartService.getCart().then((result) => {
                setTimer(Math.ceil(result.timer));
            });
        });
    };

    return (
        <div>
            {info?.length === 0 ? (
                <p>Корзина пуста</p>
            ) : timer === 0 ? (
                <button className="btn" onClick={onOrder}>
                    Заказать (${price})
                </button>
            ) : (
                <Countdown secs={timer} />
            )}
        </div>
    );
}

function InputFields() {
    const firstName = createRef();
    const lastName = createRef();
    const phone = createRef();
    const plusCode = createRef();
    const additional = createRef();

    const [errors, setErrors] = useState([]);
    const [orderFinished, setFinish] = useState(false);

    const [timer, setTimer] = useState(0);
    const onOrder = async () => {
        console.log("Order");

        cartService.deleteItems().then((_) => {
            cartService.getCart().then((result) => {
                console.log(`Timer: ${result.timer}`);
                setTimer(Math.ceil(result.timer));
                console.log(`Current Timer: ${timer}`);
            });
        });
    };

    useEffect(() => {
        cartService.getCart().then((result) => {
            setTimer(Math.ceil(result.timer));
        });
    }, []);

    const nameRegex = /^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]+$/;
    const phoneRegex = /(\+)?[0-9]+$/;
    const plusCodeRegex = /[2-9C-X]{4,8}\+[2-9C-X]+( [A-Za-z]+)?$/;
    const sumbit = async (event) => {
        event.preventDefault();
        let err = [];

        if (!nameRegex.test(firstName.current.value)) {
            err.push("Неподходящее имя");
        }

        if (!nameRegex.test(lastName.current.value)) {
            err.push("Неподходящяя фамилия");
        }

        if (!phoneRegex.test(phone.current.value)) {
            err.push("Недействительный номер телефона");
        }

        if (!plusCodeRegex.test(plusCode.current.value)) {
            err.push("Неправильный Plus Code");
        }

        if (err.length === 0) {
            onOrder();
            return;
        }

        setErrors(err);
    };

    if (orderFinished) return <p>На самом деле мы не доставляем заказы)))</p>;

    if (timer !== 0)
        return (
            <div>
                <p>Заказ прибудет через</p>
                <Countdown secs={timer} stop={() => setFinish(true)} />
            </div>
        );

    return (
        <div>
            <h5>Заполните данные для заказа</h5>
            <form onSubmit={sumbit}>
                <div>
                    {errors.map((error) => (
                        <p key={generateKey(error)}>{error}</p>
                    ))}
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="">
                            Имя и Фамилия
                        </span>
                    </div>
                    <input
                        className="form-control"
                        ref={firstName}
                        required={true}
                    />
                    <input
                        className="form-control"
                        ref={lastName}
                        required={true}
                    />
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="">
                            Номер телефона
                        </span>
                    </div>
                    <input
                        className="form-control"
                        placeholder="+XXXXXXXXXXXX"
                        ref={phone}
                        required={true}
                    />
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="">
                            Plus Code
                        </span>
                    </div>
                    <input
                        className="form-control"
                        placeholder="WH6V+XV Minsk"
                        ref={plusCode}
                        required={true}
                    />
                    <div className="input-group-append">
                        <a
                            className="btn btn-outline-secondary"
                            target="_blank"
                            href="https://maps.google.com/pluscodes/"
                        >
                            <img src="https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Info/SVG/ic_fluent_info_28_regular.svg" />
                        </a>
                    </div>
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="">
                            Номер квартиры, другая информация
                        </span>
                    </div>
                    <input
                        className="form-control"
                        placeholder=""
                        ref={additional}
                    />
                </div>

                <button className="btn" type="sumbit">
                    Заказать
                </button>
            </form>
        </div>
    );
}

export function OrderDetail({ hideCallback }) {
    const [info, setInfo] = useState([]);

    useEffect(() => {
        cartService.getCart().then((result) => {
            setInfo(result.data);
        });
    }, []);

    if (info === null) return <InputFields />;

    return (
        <div className="OrderDetail">
            <h4>Ваш заказ:</h4>
            {info?.map((el, i) => (
                <OrderItem key={generateKey(i)} item={el} />
            ))}
            <button className="btn" onClick={hideCallback}>
                Изменить заказ
            </button>
            <br />

            <InputFields />
        </div>
    );
}
