import { Point } from "geojson";

export type UserDto = {
    location: Point;
    id: string;
    email: string;
    organisation: string,
    mobile: string
}

export type NewUserDto = UserDto & {
    id?: string
}

