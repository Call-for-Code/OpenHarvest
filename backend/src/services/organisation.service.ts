import { OrganisationModel, Organisation } from "./../db/entities/organisation";
import { CoopManagerModel, CoopManager } from "./../db/entities/coopManager";

export function getAllOrganisations(lean = true) {
    if (lean)
        return OrganisationModel.find({}).lean();
    else
        return OrganisationModel.find({});
}

export function getOrganisation(id: string) {
    return OrganisationModel.findById(id);    
}

export async function createOrganisationFromName(name: string) {
    const orgModel = new OrganisationModel();
    orgModel.name = name;
    // console.log(orgModel);
    const orgDoc = orgModel.save();
    return orgDoc;
}

export function createOrganisation(org: Organisation) {
    return OrganisationModel.create(org);
}

export async function addCoopManagerToOrganisation(coopManagerId: string, orgId: string) {
    // Check if the Coop Manager exists
    const coopManager = await CoopManagerModel.findById(coopManagerId);
    if (coopManager == null) {
        throw new Error("Coop Manager doesn't exist!");
    }
    const org = await OrganisationModel.findById(orgId);
    if (org == null) {
        throw new Error("Organisation doesn't exist!");
    }
    if (org.coopManagers.includes(coopManagerId)) {
        return org;
    }
    else {
        org.coopManagers.push(coopManagerId);
        const newOrg = await org.save();
        return newOrg;
    }
}

// module.exports = CropService;
