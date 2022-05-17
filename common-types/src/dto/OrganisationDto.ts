import { UserDto } from "./UserDto";
import { AuthMethod, Integration } from "../globals";

export default interface OrganisationDto {
    name: string;
    authMethod: AuthMethod;
    integrations: Partial<Record<keyof typeof Integration, boolean>>
}

export interface UserOrganisationDto extends OrganisationDto{
    users: Omit<UserDto, "organisation">[];
}
