import * as mongoose from 'mongoose';
export const ContentSchema = mongoose.Schema({
    username: String,
    content: String,
    location: {
        name: String,
        country: String,
        checkin: []
    },
    tag:[],
    reaction:{
        like: [],
        love: [],
        comments:[],
        share:[]
    },
    comments:[],
    rate: Number,
    travel: [],
    type: String,
    range: {
        from: String,
        to: String
    },
    total_price: Number,
    hotel: [],
    images: [],
    metadata: mongoose.Schema.Types.Mixed,
    createAt: String
});