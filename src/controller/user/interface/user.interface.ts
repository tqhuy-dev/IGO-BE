import * as mongoose from 'mongoose';
export interface User {
    username: string;
    password: string;
    active: boolean;
    first_name: string;
    last_name: string;
    phone: string;
    birthday: string;
    follow: number;
    metadata: any;
    avatar: string;
    friends:[];
}