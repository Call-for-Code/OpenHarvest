import Crop from "./Crop";

export default interface FieldCrop {
    crop: Crop,
    planted_date: Date,
    harvested_date?: Date
}
