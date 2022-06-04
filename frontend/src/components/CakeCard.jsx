import React, { useEffect, useState } from "react";

import { cartService } from "./shared";

function CakeCard({ cake, callback }) {
    return (
        <div className="CakeCard">
            <img src={cake.image} alt={cake.name} />
            <h3>{cake.name}</h3>
            <p>{cake.description}</p>
            <div>
                <p>${cake.price}</p>
                <button
                    onClick={() =>
                        cartService.updateCart(cake, 1).then((_) => callback())
                    }
                >
                    В корзину
                </button>
            </div>
        </div>
    );
}

export default CakeCard;
