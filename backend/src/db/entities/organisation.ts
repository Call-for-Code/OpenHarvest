
import { Schema, model, ObjectId, Types } from 'mongoose';
import { Land } from './land';

const ObjectId = Schema.Types.ObjectId;

export interface Organisation {
    _id?: Types.ObjectId,
    name: string,
    coopManagers: string[]
}

export const OrganisationSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true        
    },
    name: String,
    coopManagers: [String]
});

export const OrganisationModel = model<Organisation>("organisation", OrganisationSchema);
