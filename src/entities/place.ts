import { model, Schema, Types } from 'mongoose';

export type Category = {
    category: 'beach' | 'mountain' | 'forest' | 'lake' | 'city';
};

export type IPlace = {
    id: Types.ObjectId;
    city: string;
    description: string;
    mustVisit: string;
    img: string;
    category: Category;
    userFav: Types.ObjectId;
    owner: Types.ObjectId;
};

export type IProtoPlace = {
    city?: string;
    description?: string;
    mustVisit?: string;
    img?: string;
    category?: Category;
    userFav?: Types.ObjectId;
    owner?: Types.ObjectId;
};

export const placeSchema = new Schema<IPlace>({
    city: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    mustVisit: String,
    img: String,
    category: String,
    userFav: Types.ObjectId,
    owner: Types.ObjectId,
});

placeSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const Place = model<IPlace>('Place', placeSchema, 'places');
