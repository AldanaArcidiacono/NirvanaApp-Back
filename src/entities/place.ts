import { model, Schema, Types } from 'mongoose';

export type Category = {
    category: 'beach' | 'mountain' | 'forest' | 'lake';
};

export type IPlace = {
    id: Types.ObjectId;
    city: string;
    description: string;
    mustVisit: string;
    img: string;
    isVisited: boolean;
    isNewPlace: boolean;
    category: Category;
    traveler: Types.ObjectId;
};

export type IProtoPlace = {
    city?: string;
    description?: string;
    mustVisit?: string;
    img?: string;
    isVisited?: boolean;
    isNewPlace?: boolean;
    category?: Category;
    traveler?: Types.ObjectId;
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
        unique: true,
    },
    mustVisit: String,
    img: String,
    isVisited: Boolean,
    isNewPlace: Boolean,
    category: String,
    traveler: Types.ObjectId,
});

placeSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const Place = model<IPlace>('Place', placeSchema, 'places');
