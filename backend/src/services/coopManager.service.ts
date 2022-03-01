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

export async function onBoardUser(oAuthSource: string, oAuthId: string, user: CoopManager, orgId: string) {
    // Check if the organisation exists
    const org = await OrganisationModel.findById(orgId);
    if (org == null) {
        throw new Error("Organisation not found");
    }
    const newID = `${oAuthSource}:${oAuthId}`
    user._id = newID;
    const userDoc = await CoopManagerModel.create(user);

    org.coopManagers.push(newID);
    const newOrg = await org.save();
    return userDoc;
}

// module.exports = CropService;
