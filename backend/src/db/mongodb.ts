// Using Node.js `require()`
import { connect } from 'mongoose';

export async function mongoInit() {
    // console.log(process.env.mongodb_url);
    if (process.env.NODE_ENV == "production") {
        await connect(process.env.mongodb_url!!, {
            sslCA: process.env.mongodb_sslCA!!
        });
    }
    else {
        await connect(process.env.mongodb_url!!);
    }
    console.log("Connected to DB");
}



