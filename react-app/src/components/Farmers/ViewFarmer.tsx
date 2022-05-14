import React, { useEffect, useState } from "react";
import { PageTitleBar, Card, CARD_SIZES } from "carbon-addons-iot-react";
import { useParams } from "react-router";
import { Farmer, getAllFarmers, getFarmer } from "../../services/farmers";

export interface ViewFarmerParams {
    farmer_id: string
}

export interface FarmerDetailsProps {
    isLoading: boolean;
    farmer: Farmer
}

/**
 * A Card that displays farmer information
 * @param isLoading If we're waiting for the farmer details
 * @param farmer Farmer details
 */
export function FarmerDetails(props: FarmerDetailsProps) {
    const {isLoading, farmer} = props;
    return <Card
        title={isLoading ? "Loading..." : farmer.name}
        size={CARD_SIZES.MEDIUMTHIN}
        style={{ height: '200px' }}
        isLoading={isLoading}
    >
        Loading...
    </Card>
}

export function ViewFarmer() {

    // Get the farmer id from the url
    const { farmer_id } = useParams<ViewFarmerParams>();
    console.log(farmer_id);

    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getFarmer(farmer_id).then(setFarmer).then(() => setIsLoading(false))
    }, [farmer_id]);

    return  <>
        <PageTitleBar
        title={farmer ? farmer.name : "Loading..."}
        forceContentOutside
        headerMode={"STATIC"}
        collapsed={false}
        />
        <div className="w-full h-[calc(100vh-96px)] flex flex-row">
            {
                isLoading ? 
                <div>
                    <FarmerDetails isLoading={isLoading} farmer={farmer!!}/>
                </div>
                : 
                <div>
                    Loading...
                </div>
            }
        </div>
    </>
}