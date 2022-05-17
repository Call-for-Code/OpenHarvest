import { Point } from "geojson";
import OrganisationDto from "./OrganisationDto";

export type UserDto = {
    location: Point;
    id: string;
    email: string;
    organisation: OrganisationDto,
    mobile: string
}

export type NewUserDto = UserDto & {
    id?: string
}

