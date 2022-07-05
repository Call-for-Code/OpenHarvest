import { CropTemplate } from "./cropTemplate"
export interface Crop {
    _id?: string;
    name: string;
    planting_season: number[],
    time_to_harvest: number,
    is_ongoing: boolean,
    yield_per_sqm: number,
    crop_template?: CropTemplate
}