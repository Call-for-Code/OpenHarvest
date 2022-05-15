import { isDefined, isUndefined, Organisation, OrganisationDto, User, UserDto } from "common-types";
import { OrganisationModel } from "../db/entities/organisation";
import { createToUserDto } from "./UserService";


class OrganisationService {

    async getOrganisationsByUserId(userId: string): Promise<Organisation[]> {
        return await OrganisationModel.find({
                "users._id": userId
            }
        ).exec();
    };

    async getAllOrganisations(lean = true): Promise<Organisation[]>  {
        if (lean)
            return OrganisationModel.find({}).lean();
        else
            return OrganisationModel.find({});
    }

    async getOrganisation(id: string): Promise<Organisation | null>  {
        return OrganisationModel.findById(id);
    }

    async createOrganisation(org: OrganisationDto): Promise<Organisation>  {
        const organisation = new OrganisationModel();

        organisation.authMethod = org.authMethod;
        organisation.users = org.users.map(userDto => {
            const user: User = {
                location: userDto.location,
                mobile: userDto.mobile
            }
            return user;
        });
        return organisation.save();
    }

    async addUserToOrganisation(userDto: UserDto): Promise<UserDto> {
        const org = await OrganisationModel.findById(userDto.organisation)
        if (isUndefined(org)) {
            throw new Error("Organisation does not exist: " + userDto.organisation);
        }

        let orgUser = org.users.find(orgUser => orgUser._id === user._id);
        if (isDefined(orgUser)) {
            return createToUserDto(orgUser, org);
        }

        const user: User = {
            location: userDto.location,
            _id: `${org.authMethod}:${userDto.id}`,
            mobile: userDto.mobile
        }

        org.users.push(user);
        await org.save();
        return createToUserDto(user, org);
    }
}

export const organisationService = new OrganisationService();
