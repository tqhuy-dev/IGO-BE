import * as mongoose from 'mongoose';
export const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    active: Boolean,
    first_name: String,
    last_name: String,
    phone: String,
    birthday: String,
    follow: Number,
    metadata: mongoose.Schema.Types.Mixed,
    avatar: String
});