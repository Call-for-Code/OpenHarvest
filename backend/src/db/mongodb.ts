// Using Node.js `require()`
import { connect } from 'mongoose';

export async function mongoInit() {
    // console.log(process.env.mongodb_url);
    await connect(process.env.mongodb_url!!);
    console.log("Connected to DB");
}



