import React, { PropsWithChildren, useEffect, useState } from "react";
import L, { LatLng } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, useMap, useMapEvents, useMapEvent } from 'react-leaflet'
import { FieldEditorLayer } from "./FieldEditorLayer";
import { EISField } from "../../types/EIS";
import { OpenHarvestMap } from "./OpenHarvestMap";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export interface PointSelectorLayerProps {
    /**
     * Existing Point
     */
    existingPoint?: LatLng;
    /**
     * Called when the point is updated
     */
    onPointSelected?: (point: LatLng) => void;
}

export function PointSelectorLayer(props: PropsWithChildren<PointSelectorLayerProps>) {

    const [markerCoords, setMarkerCoords] = useState(props.existingPoint);

    const map = useMapEvent("click", (event) => {
        setMarkerCoords(event.latlng);
        if (props.onPointSelected) {
            props.onPointSelected(event.latlng);
        }
    });
    

    return <FeatureGroup>
        {markerCoords && 
            <Marker position={markerCoords} />
        }
    </FeatureGroup>
}