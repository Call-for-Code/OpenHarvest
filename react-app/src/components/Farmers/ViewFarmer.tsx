import React, { useEffect, useState } from "react";
import { PageTitleBar, Card, CARD_SIZES } from "carbon-addons-iot-react";
import { useParams } from "react-router";
import { Farmer, getAllFarmers, getFarmer } from "../../services/farmers";
import { OpenHarvestMap } from "../Map/OpenHarvestMap";
import { FieldEditorLayer } from "../Map/FieldEditorLayer";
import { latLngBounds } from "leaflet";
import { Field, SubField } from "../../types/field";

export interface ViewFarmerParams {
    farmer_id: string
}

export interface FarmerDetailsProps {
    isLoading: boolean;
    farmer: Farmer
}

/**
 * A Card that displays farmer information.
 * @param isLoading If we're waiting for the farmer details
 * @param farmer Farmer details
 */
export function FarmerDetails(props: FarmerDetailsProps) {
    const {isLoading, farmer} = props;

    const bounds = farmer ? latLngBounds(farmer.field!!.bbox!!.southWest, farmer.field!!.bbox!!.northEast) : undefined;
    const centre = bounds?.getCenter();

    return <Card
        title={isLoading ? "Loading..." : farmer.name}
        size={CARD_SIZES.MEDIUMTHIN}
        className="w-full"
        isLoading={isLoading}
    >
        { farmer &&
        <div className="w-full h-full flex flex-row justify-between">
            <div className="flex flex-col">
                <p>Mobile: {farmer.mobile}</p>
                <p>Fields: {farmer.fieldCount}</p>
            </div>
            <div className="w-1/4">
                <OpenHarvestMap centre={centre}>
                    <FieldEditorLayer existingField={farmer.field} disableEdit></FieldEditorLayer>
                </OpenHarvestMap>
            </div>
        </div>
        }
    </Card>
}

export function FieldList(props: {field: Field}) {

}

export function SubFieldComponent(props: {subField: SubField}) {

}

export function ViewFarmer() {

    // Get the farmer id from the url
    const { farmer_id } = useParams<ViewFarmerParams>();
    // console.log(farmer_id);

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
            <FarmerDetails isLoading={isLoading} farmer={farmer!!}/>
        </div>
    </>
}