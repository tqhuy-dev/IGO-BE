import * as mongoose from 'mongoose';
export const AccountSchema = mongoose.Schema({
    token: String,
    username: String
});