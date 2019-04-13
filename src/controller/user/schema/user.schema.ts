import * as mongoose from 'mongoose';
export const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    active: Boolean,
    token: String,
    first_name: String,
    last_name: String,
    phone: String,
    birthday: String,
    follow: Number,
});