import React, { useEffect, useState } from "react";
import { cartService } from "./shared";

export function CartDetail(sharedItem) {
    const [info, setInfo] = useState("empty");

    useEffect(() => {
        cartService.getCart().then((data) => {
            setInfo(JSON.stringify(data));
            console.log(JSON.stringify(data));
        });
    }, [sharedItem]);

    return <p>{info}</p>;
}
