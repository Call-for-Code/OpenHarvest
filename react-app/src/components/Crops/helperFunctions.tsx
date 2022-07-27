import { CropTemplate, CropTemplateAPI} from "../../services/cropTemplate";

const generateReputationActionMap = (template: CropTemplate) => {
    const reputationActionMap: Record<string,boolean> = {};
    Object.keys(template.action_weights).map((key) => {
        reputationActionMap[key] = false;
    })
    return reputationActionMap;
}

export async function UpdateSubFieldWithCropTemplate(
        fields: any, 
        cropTemplateAPI: CropTemplateAPI, 
        selectedCrop: string, 
        selectedCropTemplate: CropTemplate
    ){
    
        for(let fieldIndex in fields){

            let currentField = fields[fieldIndex];
        
            // for every field found with a subfield using the crop selected, update the subfield to
            // have an associated crop_template<CropTemplate> and reputationActions<string,boolean>
            const subFieldsArray: any = currentField.subFields;
            for(let subFieldIndex in subFieldsArray){
                const subFieldCropsArray: any = subFieldsArray[subFieldIndex].properties.crops;
                for(let subFieldCropIndex in subFieldCropsArray){
                    if(subFieldCropsArray[subFieldCropIndex].crop._id?.toString() === selectedCrop && 
                        !subFieldCropsArray[subFieldCropIndex].crop_template &&
                        !subFieldCropsArray[subFieldCropIndex].reputation_actions){
                        subFieldCropsArray[subFieldCropIndex].crop_template = selectedCropTemplate;
                        subFieldCropsArray[subFieldCropIndex].reputation_actions = generateReputationActionMap(selectedCropTemplate);
                    }
                }
            }

            // update field.subfields.properties.crops with reputation and croptemplate in mongodb
            const res = await cropTemplateAPI.addCropTemplateToField(currentField);
            console.log("updated field: ", res)
    }
}

export function OrganizeReputationActions(field: any): Record<string, boolean>[]{
    let reputationMaps: Record<string, boolean>[] = []

    const subFieldsArray: any = field.subFields;
    for(let subFieldIndex in subFieldsArray){
        const subFieldCropsArray: any = subFieldsArray[subFieldIndex].properties.crops;
        for(let subFieldCropIndex in subFieldCropsArray){
            if(subFieldCropsArray[subFieldCropIndex].reputation_actions != null){
                reputationMaps.push(subFieldCropsArray[subFieldCropIndex].reputation_actions!)
            }
        }
    }
    
    return reputationMaps
}