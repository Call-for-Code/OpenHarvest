import { CoopManagerModel, CoopManager } from "./../db/entities/coopManager";
import { OrganisationModel, Organisation } from "./../db/entities/organisation";

export function getCoopManager(id: string) {
    return CoopManagerModel.findById(id);
}

/**
 * Explicit use of the word user here because it's the OAuth User we're talking about.
 * provider + id
 * e.g. "IBMid:1SD54A1"
 */
export async function doesUserExist(id: string) {
    const manager = await CoopManagerModel.findById(id);
    return manager !== null;
}

export async function onBoardUser(oAuthSource: string, oAuthId: string, user: CoopManager) {
    // Check if the organisation exists
    const orgs = await OrganisationModel.find({
        _id: {
            $in: [user.coopOrganisations]
        }
    });
    if (orgs.length !== user.coopOrganisations.length) {
        throw new Error("Organisation's given weren't found!");
    }
    const newID = `${oAuthSource}:${oAuthId}`
    user._id = newID;
    const userDoc = await CoopManagerModel.create(user);
    return userDoc;
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

    if (coopManager.coopOrganisations.includes(coopManagerId)) {
        return org;
    }
    else {
        coopManager.coopOrganisations.push(orgId);
        const newCoopManager = await coopManager.save();
        return newCoopManager;
    }
}

// module.exports = CropService;
