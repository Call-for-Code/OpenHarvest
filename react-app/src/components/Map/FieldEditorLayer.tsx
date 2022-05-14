import { Feature, FeatureCollection, Polygon } from "geojson";
import React, { PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { Circle, FeatureGroup, GeoJSON } from "react-leaflet";
import { Polygon as leafletPolygon } from "leaflet";
import { EditControl } from "react-leaflet-draw";
import produce from "immer"
import { Field, SubField, SubFieldProperties } from "../../types/field";

export interface FieldEditorLayerProps {
    /**
     * An existing one. If this is null or undefined a new one will be created and used.
     */
    existingField?: Field;
    /**
     * Called when the field is updated in some way.
     */
    onFieldUpdated?: (field: Field) => void;
}


/**
 * This component displays a map that allows the user to create and edit fields. Calls events defined in props
 * to update the parent component
 * @returns FieldEditorMap Component
 */
export function FieldEditorLayer(props: PropsWithChildren<FieldEditorLayerProps>): ReactElement {

    // field will be late inited as part of the use effect which is why the type doesn't include `| null`
    // As to why I'm using a ref, it's because react-leaflet-draw doesn't update it's OnCreated Callback
    // Read more here: https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
    // const [field, setField] = useState<EISField>(null!!);
    const fieldRef = useRef<Field>(null!!)
    const [fieldLayers, setFieldLayers] = useState<React.ReactElement[]>([]);

    function makeFieldLayers(field: Field) {
        if (field == null) {
            return;
        }
        const layers = field.subFields.map(it => <GeoJSON data={it} />);
        setFieldLayers(layers);
    }

    const onCreated = (event: any) => {
        console.log("created", event.layer);
        console.log(fieldRef.current, props.onFieldUpdated);

        const layer = event.layer;

        const subfieldGeoJSON = layer.toGeoJSON() as Feature<Polygon, SubFieldProperties>;
        
        // @ts-expect-error Name is set further down.
        const subfield: SubField = subfieldGeoJSON;
        subfield.properties = {
            crops: []
        }
        subfield.name = "Name"

        // Create a new object for components listening outside
        const newField = produce(fieldRef.current, (draftField) => {
            draftField.subFields.push(subfield);
        });

        fieldRef.current = newField;
        
        if (props.onFieldUpdated) {
            props.onFieldUpdated(newField);
        }
        
    };

    // console.log("Render", fieldRef.current, onCreated);

    function polygonEdited(layer: leafletPolygon<SubFieldProperties>) {

    }
    function polygonDeleted(layer: leafletPolygon<SubFieldProperties>) {

    }

    useEffect(() => {
        const field_in = props.existingField;
        let newField: Field;
        if (field_in == null || field_in == undefined) {
            // Create a field
            newField = {
                farmer_id: "",
                subFields: []
            };
        }
        else {
            // check if there are subfields and draw them
            newField = field_in;
        }
        // field = newField;
        fieldRef.current = newField;
        // console.log("Parsing Existing field", newField);
    }, [props.existingField]);

    useEffect(() => {
        makeFieldLayers(fieldRef.current);
    }, [fieldRef.current ? fieldRef.current.subFields.length : -1])

    return <FeatureGroup>
        <EditControl
            position='topright'
            onEdited={(event: any) => {console.log("edited", event.layer)}}
            onCreated={(e: any) => onCreated(e)}
            onDeleted={(event: any) => console.log("deleted", event.layer)}
            draw={{
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false
            }}
        />
    </FeatureGroup>
}