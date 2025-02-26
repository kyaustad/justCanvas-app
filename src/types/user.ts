import type { Office } from "./office";

export interface User {
    _id?: string;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    role: number;
    offices: Office[];
    supervisor?: User;
}