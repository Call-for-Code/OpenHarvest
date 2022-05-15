import { EISConfig, Farm, Farmer, Field, NewFarm, NewField } from "common-types";
import { EISField, EISFieldCreateResponse, EISSubField, EISSubFieldProperties, EISSubFieldSearchReturn, FieldResponse, OpenHarvestSubFieldProps } from "./EIS.types";
import { EISService } from "./EISService";
import { Feature, FeatureCollection, Polygon } from "geojson";

export class EISFarmService extends EISService {

    async getFarmerFarms(eisConfig: EISConfig, farmer: Farmer): Promise<Farm[]> {
        const eisSession = await this.getToken(eisConfig);

        const queryBody = {
            "uuidsOnly": false,
            "inputType": "SPECIFIED_FIELD",
            "includeDeleted": true,
            "includeAssetGeometry": true,
            "properties": {
                open_harvest: {
                    farmer_id: farmer?._id
                }
            }
        };

        const res = await eisSession.authAxios.post<EISSubFieldSearchReturn>(eisSession.eisConfig.apiUrl + "asset/search", queryBody);
        const subfields = res.data;

        if (subfields.totalRecords == 0) {
            return [];
        }

        // Get the parent reference which points to the field uuid
        const parentRefs: {[name: string] : string} = {};

        subfields.features.forEach((subField) => {
            parentRefs[subField.parentReference] = subField.parentReference;
        });

        const farms: Farm[] = [];

        try {
            for (const parentRef of Object.keys(parentRefs)) {
                farms.push(await this.getFarm(eisConfig, parentRef, farmer));
            }
        } catch (e) {
            console.error(e);
        }
        return farms;
    }

    async saveFarm(eisConfig: EISConfig, farm: NewFarm): Promise<Farm> {
        const eisSession = await this.getToken(eisConfig);

        const eisField: EISField = {
            name: farm.name,
            subFields: farm.fields.map((field) => EISFarmService.convertToEisSubField(farm.farmer, field))
        };

        const res = await eisSession.authAxios.post<EISFieldCreateResponse>(eisSession.eisConfig.apiUrl + "field", eisField);

        return this.getFarm(eisConfig, res.data.field, farm.farmer);
    }

    private async getFarm(eisConfig: EISConfig, uuid: string, farmer: Farmer): Promise<Farm> {
        const eisSession = await this.getToken(eisConfig);

        const fieldRes = await eisSession.authAxios.get<FieldResponse>(eisSession.eisConfig.apiUrl + `field/${uuid}`);

        const fieldResponse: FieldResponse = fieldRes.data;

        const fields: Field[] = [];
        for (const subField of fieldResponse.subFields.features) {
            // We need to convert the open harvest object from a string to JSON because EIS stores it as a string
            const openHarvestProps: OpenHarvestSubFieldProps = JSON.parse(subField.properties.open_harvest as any);

            let field: Field = {
                _id: subField.uuid,
                geoShape: subField.geometry,
                name: subField.properties.field_name,
                crops: openHarvestProps.crops
            };

            fields.push(field);
        }

        return {_id: uuid, fields, farmer, name: fieldResponse.properties.name};
    }

    private static convertToEisSubField(farmer: Farmer, field: NewField): EISSubField {
        const feature: Feature<Polygon, EISSubFieldProperties> = {
            geometry: field.geoShape,
            properties: {
                farm_name: field.name,
                open_harvest_farmer_id: farmer._id,
                open_harvest: {
                    farmer_id: farmer._id,
                    crops: field.crops
                }
            },
            type: "Feature"
        }

        const featureCollection: FeatureCollection<Polygon, EISSubFieldProperties> = {
            features: [feature],
            type: "FeatureCollection"
        }

        return {
            geo: {
                geojson: featureCollection,
                type: "geojson"
            },
            name: field.name
        }
    }
}

export const eisFarmService: EISFarmService = new EISFarmService();
