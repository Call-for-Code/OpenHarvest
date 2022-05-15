import { isUndefined, NewUserDto, Organisation, User, UserDto } from "common-types";
import { organisationService } from "./OrganisationService";


class UserService {

    async getUser(userId: string): Promise<UserDto[]> {
        const orgs: Organisation[] = await organisationService.getOrganisationsByUserId(userId);

        if (isUndefined(orgs) || orgs.length === 0) {
            return [];
        }

        const userDtos: UserDto[] = [];

        orgs.forEach(org => {
            org.users.filter(user => user._id === userId).map(user => {
                userDtos.push(createToUserDto(user, org));
            })
        });

        return userDtos;
    }

    /**
     * Explicit use of the word user here because it's the OAuth User we're talking about.
     * provider + id
     * e.g. "IBMid:1SD54A1"
     */
    async doesUserExist(userDto: UserDto): Promise<boolean> {
        return (await this.getUser(userDto.id)) != null
    }

    async onBoardUser(userDto: NewUserDto): Promise<UserDto> {
        // Check if the organisation exists
        return await organisationService.addUserToOrganisation(userDto);

    }
}

export const userService = new UserService();

export function createToUserDto(user: User, org: Organisation): UserDto {
    if (isUndefined(user._id)) {
        throw new Error("User does not have id.")
    }
    return {
        email: "",
        location: user.location,
        mobile: user.mobile,
        organisation: org.name,
        id: user._id
    };
}
