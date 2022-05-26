import React, { useEffect, useState } from "react";
import CakeCard from "./CakeCard";
import { cakesService } from "./shared";

const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
};

export function CakeTable({ callback }) {
    const [cakes, setCakes] = useState(null);

    useEffect(() => {
        cakesService.getCakes().then((data) => {
            setCakes(data.data);
            // alert(JSON.stringify(data));
        });
    }, []);

    if (cakes == null) return <div />;

    return (
        <div className="CakeTable">
            {cakes?.map((el, i) => (
                <CakeCard key={generateKey(i)} cake={el} callback={callback} />
            ))}
            {cakes?.map((el, i) => (
                <CakeCard key={generateKey(i)} cake={el} callback={callback} />
            ))}
            {cakes?.map((el, i) => (
                <CakeCard key={generateKey(i)} cake={el} callback={callback} />
            ))}
        </div>
    );
}
