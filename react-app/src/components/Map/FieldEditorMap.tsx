import React, { PropsWithChildren, useEffect } from "react";
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { FieldEditorLayer } from "./FieldEditorLayer";
import { EISField } from "./../../types/EIS";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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

export function FieldEditorMap(props: PropsWithChildren<FieldEditorMapProps>) {

    const onUpdated = (field: EISField) => {
        if (props.onFieldUpdated) {
            props.onFieldUpdated(field);
        }
    }


    return (
        <MapContainer center={[	-33.865143, 151.209900]} zoom={13} className="w-full h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FieldEditorLayer onFieldUpdated={onUpdated}></FieldEditorLayer>
        </MapContainer>
    )
}