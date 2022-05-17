/**
 * LatLng representation for the Weather Company
 */
import { DataFormat, Integration, isDefined, isUndefined, Language, Unit } from "./globals";
import Crop from "./data-model/Crop";
import Farm, { NewFarm } from "./data-model/Farm";
import User from "./data-model/User";
import Farmer, { NewFarmer } from "./data-model/Farmer";
import Organisation from "./data-model/Organisation";
import FieldCrop from "./data-model/FieldCrop";
import Field, { NewField } from "./data-model/Field";
import { NewUserDto, UserDto } from "./dto/UserDto";
import OrganisationDto, { UserOrganisationDto } from "./dto/OrganisationDto";
import { EISConfig } from "./integrations/EISConfig";
import { WeatherCompanyConfig } from "./integrations/WeatherCompanyConfig";
import { Point } from "geojson";

export  { DataFormat, Language, Unit, isDefined, isUndefined };
export { Crop, Farm, NewFarm, User, Farmer, NewFarmer, Organisation, Field, NewField, FieldCrop, Integration};

export {EISConfig, WeatherCompanyConfig}

export {UserDto, NewUserDto, OrganisationDto, UserOrganisationDto};

export type LatLngNumber = {
    lat: number,
    lng: number
}

export type LatLngString = {
    lat: string,
    lng: string
}

export type GeoCodeNumber = {
    latitude: number,
    longitude: number
}

export function toLatLng(geoCode: GeoCodeNumber): LatLngNumber {
    return {
        lat: geoCode.latitude,
        lng: geoCode.longitude
    }
}

export function toGeoCode(latLng: LatLngNumber): GeoCodeNumber {
    return {
        latitude: latLng.lat,
        longitude: latLng.lng
    }
}

export function toGroCodeFromPoint(point: Point): GeoCodeNumber {
    return {
        latitude: point.coordinates[0],
        longitude: point.coordinates[1]
    }
}

export function geoCodeToString(geocode: GeoCodeNumber) {
    return `${geocode.latitude},${geocode.longitude}`
}

export interface CommonOptions {
    format: DataFormat;
    language: Language;
    units: Unit
}


