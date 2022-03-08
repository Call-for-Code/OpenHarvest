// Using Node.js `require()`
import { connect } from 'mongoose';
import { writeFile } from "fs/promises";

export async function mongoInit() {
    // console.log(process.env.mongodb_url);
    if (process.env.NODE_ENV == "production") {
        // We have to write the SSL cert contents so that mongoose can read it again...
        if (process.env.mongodb_sslCA == undefined) {
            throw new Error("Please define mongodb_sslCA in the environment with the SSL !")
        }
        const CACertStr = process.env.mongodb_sslCA.replace("\\n", "\n"); // replace text with actual new lines.
        await writeFile("mongoose_sslCA", CACertStr);

        await connect(process.env.mongodb_url!!, {
            sslValidate: false,
            sslCA: "mongoose_sslCA"
        });
    }
    else {
        await connect(process.env.mongodb_url!!);
    }
    console.log("Connected to DB");
}



