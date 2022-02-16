// Using Node.js `require()`
import { connect } from 'mongoose';

export async function mongoInit() {
    connect('mongodb://localhost/open-harvest');
}



