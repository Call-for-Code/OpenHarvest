import { FeatureCollection, Polygon } from "geojson";
import React, { PropsWithChildren, ReactElement } from "react";
import { Circle, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

export interface EISSubFieldProperties {
    farm_name: string
    open_harvest: {
        farmer_id: string;
        /**
         * Because EIS doesn't support all the crops they grow in Malawi
         */
        actual_crop_history_id: string[];
    }
}

export interface EISSubField {
    name: string;
    geo: {
        type: "geojson" // We only support GeoJSON...
        geojson: FeatureCollection<Polygon, EISSubFieldProperties>
    }
}

export interface EISField {
    name: string;
    subFields: EISSubField[]
}

export interface FieldEditorMapProps {
    /**
     * An existing one. If this is null or undefined a new one will be created and used.
     */
    existingField?: EISField;
    /**
     * Called when the field is updated in some way.
     */
    onFieldUpdated?: (field: EISField) => void;
}


/**
 * This component displays a map that allows the user to create and edit fields. Calls events defined in props
 * to update the parent component
 * @returns FieldEditorMap Component
 */
export function FieldEditorLayer(props: PropsWithChildren<FieldEditorMapProps>): ReactElement {
        
    return <FeatureGroup>
        <EditControl
            position='topright'
            onEdited={() => console.log("edited")}
            onCreated={() => console.log("created")}
            onDeleted={() => console.log("deleted")}
            draw={{
                rectangle: false
            }}
        />
        <Circle center={[51.51, -0.06]} radius={200} />
    </FeatureGroup>
}