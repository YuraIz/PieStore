import React from "react";

export function PopUp({ toggle, children }) {
    return (
        <div>
            <div className="PopUpBackground" onClick={toggle}></div>
            <div className="PopUp">{children}</div>
        </div>
    );
}
