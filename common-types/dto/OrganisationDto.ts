import { UserDto } from "./UserDto";
import { AuthMethod } from "../globals";

export default interface OrganisationDto {
    name: string;
    authMethod: AuthMethod;
    users: Omit<UserDto, "organisation">[]
}
