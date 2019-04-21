import * as mongosee from 'mongoose';
export const LocationSchema = mongosee.Schema({
    city: String,
    name: String,
    rate: Number,
    checkin: Number,
    reviews:[],
    trend: String,
    price: Number,
});