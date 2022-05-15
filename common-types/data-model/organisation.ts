import User from "./User";
import { AuthMethod } from "../globals";
import { EISConfig, WeatherCompanyConfig } from "../types";

export default interface Organisation {
    name: string,
    authMethod: AuthMethod,
    users: User[],
    eisConfig?: EISConfig,
    weatherCompanyConfig?: WeatherCompanyConfig
}
