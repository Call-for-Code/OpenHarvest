import Farm, { NewFarm } from "./Farm";

export interface NewFarmer {
    _id?: string,
    name: string,
    mobile: string[],
    address: string,
    organisation: string,
    farms: NewFarm[]
}

export default interface Farmer extends NewFarmer{
    _id: string,
    farms: Farm[]
}
