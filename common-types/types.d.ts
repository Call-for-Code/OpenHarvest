/**
 * LatLng representation for the Weather Company
 */
import { DataFormat, isDefined, isUndefined, Language, Unit } from "./globals";
import Crop from "./data-model/Crop";
import Farm, { NewFarm } from "./data-model/Farm";
import User, { OrganisationUser } from "./data-model/User";
import Farmer, { NewFarmer } from "./data-model/Farmer";
import Organisation from "./data-model/Organisation";
import FieldCrop from "./data-model/FieldCrop";
import Field, { NewField } from "./data-model/Field";
import { NewUserDto, UserDto } from "./dto/UserDto";
import OrganisationDto from "./dto/OrganisationDto";
import { EISConfig } from "./integrations/EISConfig";
import { WeatherCompanyConfig } from "./integrations/WeatherCompanyConfig";
import { Point } from "geojson";

export  { DataFormat, Language, Unit, isDefined, isUndefined };

export { Crop, Farm, NewFarm, User, OrganisationUser, Farmer, NewFarmer, Organisation, Field, NewField, FieldCrop };

export {EISConfig, WeatherCompanyConfig}

export {UserDto, NewUserDto, OrganisationDto};

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

export type GeoCodeString = {
    latitude: string,
    longitude: string
}

export type LatLng = LatLngNumber | LatLngString;
export type GeoCode = GeoCodeNumber | GeoCodeString;

export function toLatLng(geoCode: GeoCode): LatLng {
    return {
        lat: geoCode.latitude,
        lng: geoCode.longitude
    }
}

export function toGeoCode(latLng: LatLng): GeoCode {
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

export type BoundingBox = {
    lowerLeft: LatLng,
    upperRight: LatLng
}

export interface CommonOptions {
    format: DataFormat;
    language: Language;
    units: Unit
}


