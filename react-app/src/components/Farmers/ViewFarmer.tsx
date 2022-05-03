import React, { useEffect, useState } from "react";
import { PageTitleBar, StatefulTable, Button, InlineLoading } from "carbon-addons-iot-react";
import { useParams } from "react-router";
import { Farmer, getAllFarmers, getFarmer } from "../../services/farmers";

export interface ViewFarmerParams {
    farmer_id: string
}

export function ViewFarmer() {

    // Get the farmer id from the url
    const { farmer_id } = useParams<ViewFarmerParams>();
    console.log(farmer_id);

    const [farmer, setFarmer] = useState<Farmer | null>(null);

    useEffect(() => {
        getFarmer(farmer_id).then(setFarmer);
    }, [farmer_id]);

    return  <>
        <PageTitleBar
        title={farmer ? farmer.name : "Loading..."}
        forceContentOutside
        headerMode={"STATIC"}
        collapsed={false}
        />
        <div className="w-full h-[calc(100vh-96px)] flex flex-row">
        </div>
    </>
}