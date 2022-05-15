import { model, Schema } from 'mongoose';

import { Organisation, User } from "common-types";

export const UserSchema = new Schema<User>({
    /**
     * Auth provider + auth provider id. E.g. "IBMid:1SDAS61W6A"
     */
    _id: String,
    /**
     *  GeoCode / LatLng coordinate tuple
     */
    location: [{
        type: "Point",
        coordinates: [Number]
    }],
    mobile: String,
});


export const OrganisationSchema = new Schema<Organisation>({
    name: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    users: [UserSchema]
}, { _id : false });

export const OrganisationModel = model<Organisation>("organisation", OrganisationSchema);
