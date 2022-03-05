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

export function getOrganisations(id: string[], lean = true) {
    const query = OrganisationModel.find({_id: {$in: id}});
    return lean ? query.lean() : query;
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

// module.exports = CropService;
