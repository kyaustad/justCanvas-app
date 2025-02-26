import type { Coordinate } from "ol/coordinate";

export interface Pin {
    _id?: string;
    coordinates: {
        type: string;
        coordinates: Coordinate
    },
    owner: string;
    office: string;
    type: "Not Interesed" | "Not Home" | "No Knock" | "Sale" | "Go Back" | "Pitched" | string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    name?: string;
    phone?: string;
    email?: string;
    notes?: string;
    createdAt?: Date;
}