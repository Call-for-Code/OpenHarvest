// Using Node.js `require()`
import { connect } from 'mongoose';

export async function mongoInit() {
    await connect('mongodb://localhost/open-harvest');
    console.log("Connected to DB");
}



