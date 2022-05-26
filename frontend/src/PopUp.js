import React from "react";

export function PopUp({ toggle, children }) {
    return (
        <div className="PopUpBackground" onClick={toggle}>
            <div className="PopUp">{children}</div>
        </div>
    );
}
