import { EISConfig, isDefined, isUndefined, Organisation, OrganisationDto, User, UserDto, UserOrganisationDto, WeatherCompanyConfig } from "../../../common-types/src";
import { OrganisationModel } from "../db/entities/organisation";
import { toUserDto } from "./UserService";


class OrganisationService {

    async getOrganisationsByUserId(userId: string): Promise<UserOrganisationDto[]> {

        const organisations = await OrganisationService.findAll({
            "users._id": userId
        });

        return organisations.map(org => toUserOrganisationDto(org));
    };

    async getAllOrganisations(filter = {}): Promise<OrganisationDto[]>  {
        const organisations = await OrganisationService.findAll(filter);
        return organisations.map(org => toOrganisationDto(org));
    }

    async getOrganisation(id: string): Promise<OrganisationDto | null>  {
        const org = await OrganisationModel.findById(id);
        return isUndefined(org) ? null : toOrganisationDto(org);
    }

    async createOrganisation(org: UserOrganisationDto): Promise<OrganisationDto>  {
        const organisation = new OrganisationModel();

        organisation.authMethod = org.authMethod;
        organisation.users = org.users.map(userDto => {
            const user: User = {
                location: userDto.location,
                mobile: userDto.mobile
            }
            return user;
        });
        return toOrganisationDto(await organisation.save());
    }

    async addUserToOrganisation(userDto: UserDto): Promise<UserDto> {
        const org = await OrganisationModel.findById(userDto.organisation)
        if (isUndefined(org)) {
            throw new Error("Organisation does not exist: " + userDto.organisation);
        }

        let orgUser = org.users.find(orgUser => orgUser._id === user._id);
        if (isDefined(orgUser)) {
            return toUserDto(orgUser, org);
        }

        const user: User = {
            location: userDto.location,
            _id: `${org.authMethod}:${userDto.id}`,
            mobile: userDto.mobile
        }

        org.users.push(user);
        await org.save();
        return toUserDto(user, org);
    }

    async getEISConfig(orgName: string): Promise<EISConfig | undefined> {
        const org = await OrganisationModel.findById(orgName);

        if (isUndefined(org)) {
            throw new Error("Organisation does not exist: " + orgName);
        }

        return org.eisConfig;
    }

    async getWeatherCompanyConfig(orgName: string): Promise<WeatherCompanyConfig | undefined> {
        const org = await OrganisationModel.findById(orgName);

        if (isUndefined(org)) {
            throw new Error("Organisation does not exist: " + orgName);
        }

        return org.weatherCompanyConfig;
    }


    private static async findAll(filter = {}): Promise<Organisation[]> {
        return OrganisationModel.find(filter).lean();
    }
}

export const organisationService = new OrganisationService();

export function toOrganisationDto(org: Organisation): OrganisationDto {
    return {
        name: org.name,
        authMethod: org.authMethod,
        integrations: {
            EIS: isDefined(org.eisConfig),
            WEATHER: isDefined(org.weatherCompanyConfig)
        }
    };
}

export function toUserOrganisationDto(org: Organisation): UserOrganisationDto {
    const dto = toOrganisationDto(org);
    return {
        ...dto,
        users: org.users.map(user => toUserDto(user, org))
    };
}
