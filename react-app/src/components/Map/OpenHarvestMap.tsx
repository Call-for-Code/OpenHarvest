import React, { PropsWithChildren, useEffect } from "react";
import L, { latLng, LatLng, LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { FieldEditorLayer } from "./FieldEditorLayer";
import { EISField } from "./../../types/EIS";
import { useAuth } from "../../services/auth";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export interface OpenHarvestMapProps {

}
/**
 * The default map component for open harvest.
 * It integrated with the user object if it exists and loads it's configuration automatically (Centre, zoom)
 * We can also eventually provide additional layers here later
 * @param props Props
 * @returns 
 */
export function OpenHarvestMap(props: PropsWithChildren<OpenHarvestMapProps>) {

    let defaultCentreCoords = latLng([-13.805811, 32.888162]); // Mchinji, Malawai
    const defaultZoom = 13;

    const auth = useAuth();

    if (auth.isLoggedIn) {
        defaultCentreCoords = latLng(auth.user!!.coopManager!!.location as LatLngTuple);
    }

    return (
        <MapContainer center={defaultCentreCoords} zoom={defaultZoom} className="w-full h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.children}
        </MapContainer>
    )
}