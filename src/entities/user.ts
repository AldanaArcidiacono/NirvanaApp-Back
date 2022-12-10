import { model, Schema, Types } from 'mongoose';

export type IUser = {
    id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    favPlaces: Array<Types.ObjectId>;
    createdPlaces: Array<Types.ObjectId>;
    img: string;
};

export type IProtoUser = {
    name?: string;
    email?: string;
    password?: string;
    favPlaces?: Array<Types.ObjectId>;
    createdPlaces?: Array<Types.ObjectId>;
    img?: string;
};

export const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    favPlaces: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Place',
        },
    ],
    createdPlaces: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Place',
        },
    ],
    img: String,
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});

export const User = model<IUser>('User', userSchema, 'users');
