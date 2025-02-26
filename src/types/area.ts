import type { User } from "./user";
export interface Area {
    _id?: string;
    type: "Polygon";
    geometry: {
        type: "Polygon";
        coordinates: Array<Array<Array<number>>>;
    };
    owners?: string[] |  User[];
    office: string;


}