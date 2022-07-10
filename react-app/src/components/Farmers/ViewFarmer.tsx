import React, { useEffect, useState } from "react";
import { PageTitleBar, Card, CARD_SIZES } from "carbon-addons-iot-react";
import { useParams } from "react-router";
import { Farmer, getAllFarmers, getFarmer } from "../../services/farmers";
import { OpenHarvestMap } from "../Map/OpenHarvestMap";
import { FieldEditorLayer } from "../Map/FieldEditorLayer";
import { latLngBounds } from "leaflet";
import { Field, SubField, SubFieldCrop } from "../../types/field";
import { ExpandableTile, SkeletonText, TileAboveTheFoldContent, TileBelowTheFoldContent } from "carbon-components-react";
import { GeoJSON } from "react-leaflet";
import { area } from "@turf/turf";

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

export function FieldList(props: {isLoading: boolean, field: Field | undefined}) {
    const {isLoading, field} = props;
    
    return <div>
        {isLoading ?
            [0, 1].map(_ => 
                <SubFieldComponent isLoading subField={undefined} />
            )
        :
            field!!.subFields.map(it => 
                <SubFieldComponent isLoading={false} subField={it} />
            )
        }
    </div>
}

export function SubFieldComponent(props: {isLoading: boolean, subField: SubField | undefined}) {
    const {isLoading, subField} = props;

    /**
     * TODO: Move me to common types
     */
    function getPlantedCrop(crops: SubFieldCrop[]) {
        return crops.find(it => it.harvested === null);
    }

    function getPlantedCropName(crops: SubFieldCrop[]) {
        const crop = getPlantedCrop(crops);
        if (crop) {
            return crop.crop.name;
        }
        else if (crops.length > 0) {
            return crops[0].crop.name
        }
        else {
            return "None"
        }
    }

    function squareMetresToHa(sqm: number) {
        return sqm / 1000;
    }    

    const plantedCrop = isLoading ? undefined : getPlantedCrop(subField!!.properties.crops);
    const plantedCropName = isLoading ? undefined : getPlantedCropName(subField!!.properties.crops);

    let plantedDate = "";
    let harvestedDate = "--";
    let expectedYield = "";

    if (subField && plantedCrop) {

        plantedDate = plantedCrop.planted.toLocaleDateString();
        harvestedDate = plantedCrop.harvested ? plantedCrop.harvested.toLocaleDateString() : "--";
        
        const sqm = squareMetresToHa(area(subField));
        expectedYield = (sqm * 100).toFixed(2);
    }
    
    

    return <ExpandableTile>
        <TileAboveTheFoldContent>
            <div className="h-[80px] flex flex-row justify-between">
                { isLoading ?
                    <div className="h-[80px]">
                        <SkeletonText heading width="30%" />
                    </div>
                :
                    <div className="h-[80px] w-full flex flex-row justify-between">
                        <div className="">
                            <p className="font-bold">Name</p>
                            <p>{subField!!.name}</p>
                        </div>
                        <div>
                            <p className="font-bold">Crop Planted</p>
                            <p>{plantedDate}</p>
                        </div>                   
                        <div>
                            <p className="font-bold">Date Planted</p>
                            <p>{plantedCropName}</p>
                        </div>                   
                        <div>
                            <p className="font-bold">Harvest Date</p>
                            <p>{harvestedDate}</p>
                        </div>                   
                        <div>
                            <p className="font-bold">Expected Yield</p>
                            <p>{expectedYield} Ha</p>
                        </div>                   
                    </div>
                }
            </div>
            
        </TileAboveTheFoldContent>
        <TileBelowTheFoldContent>
            Field History and current status
            <div className="w-1/4 h-[200px]">
                <OpenHarvestMap centre={isLoading ? undefined : subField!!.properties.centre}>
                    {!isLoading &&
                        <GeoJSON data={subField!!} />
                    }
                </OpenHarvestMap>
            </div>
        </TileBelowTheFoldContent>

    </ExpandableTile>

    
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
        <div className="w-full h-[calc(100vh-96px)] p-[30px] space-y-[20px]">
            <FarmerDetails isLoading={isLoading} farmer={farmer!!}/>
            <h2>Fields</h2>
            <FieldList isLoading={isLoading} field={farmer ? farmer.field : undefined} />
        </div>
        
    </>
}