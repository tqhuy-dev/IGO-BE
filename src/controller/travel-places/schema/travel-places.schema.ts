import * as mongoose from 'mongoose';
export const TravelPlacesSchema = mongoose.Schema({
    country: String,
    name: String,
    rate: Number,
    checkin: Number,
    weather: mongoose.Schema.Types.Mixed,
    trend: String,
    description: String
})