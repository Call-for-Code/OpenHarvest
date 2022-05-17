// Using Node.js `require()`
import { connect, Schema } from 'mongoose';

export async function mongoInit() {
    // console.log(process.env.mongodb_url);
    if (process.env.NODE_ENV == "production") {
        // We have to write the SSL cert contents so that mongoose can read it again...
        if (process.env.mongodb_sslCA_Path == undefined) {
            throw new Error("Please define mongodb_sslCA_Path in the environment with the SSL !")
        }
        // const CACertStr = process.env.mongodb_sslCA.replace("\\n", "\n"); // replace text with actual new lines.
        // await writeFile("mongoose_sslCA", CACertStr);

        await connect(process.env.mongodb_url!!, {
            sslValidate: false,
            sslCA: process.env.mongodb_sslCA_Path
        });
    }
    else {
        await connect(process.env.mongodb_url!!);
    }
}

export const PointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

export const PolygonSchema = new Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of numbers
        required: true
    }
});



