

export interface Farmer {
    _id?: Types.ObjectId,
    name: string,
    mobile: string[],
    coopOrganisations: string[]
    land_ids: string[]
    lands?: Land[]
}

export const FarmerSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    name: String,
    mobile: [String],
    coopOrganisations: [String],
    land_ids: [ObjectId]
});

export const FarmerModel = model<Farmer>("farmer", FarmerSchema);