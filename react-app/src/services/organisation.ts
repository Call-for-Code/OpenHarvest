import axios from 'axios'

export interface Organisation {
    _id?: string,
    name: string,
    coopManagers: string[]
}

export async function getAllOrganisations(): Promise<Organisation[]> {
    const res = await fetch("/api/organisation/");
    return res.json();
}

export async function createOrganisation(name: string) {
    const data = await axios.post<Organisation>("/api/organisation/", {name})
    return data.data;
}