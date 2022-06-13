import { Field, SubField, SubFieldCrop} from "../../../../backend/src/db/entities/field"
// import { Crop } from "../../services/crops";
import { CropTemplate, CropTemplateAPI} from "../../services/cropTemplate";

const generateReputationActionMap = (template: CropTemplate) => {
    const reputationActionMap: Record<string,boolean> = {};
    Object.keys(template.action_weights).map((key) => {
        reputationActionMap[key] = false;
    })
    return reputationActionMap;
}

export async function UpdateSubFieldWithCropTemplate(
        fields: Field[], 
        cropTemplateAPI: CropTemplateAPI, 
        selectedCrop: string, 
        selectedCropTemplate: CropTemplate
    ){
    
        for(let fieldIndex in fields){

            let currentField = fields[fieldIndex];
        
            // for every field found with a subfield using the crop selected, update the subfield to
            // have an associated crop_template<CropTemplate> and reputationActions<string,boolean>
            const subFieldsArray: SubField[] = currentField.subFields;
            for(let subFieldIndex in subFieldsArray){
                const subFieldCropsArray: SubFieldCrop[] = subFieldsArray[subFieldIndex].properties.crops;
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
            const res = await cropTemplateAPI.putField(currentField);
    }
}

export function OrganizeReputationActions(field: Field): Record<string, boolean>[]{
    let reputationMaps: Record<string, boolean>[] = []

    const subFieldsArray: SubField[] = field.subFields;
    for(let subFieldIndex in subFieldsArray){
        const subFieldCropsArray: SubFieldCrop[] = subFieldsArray[subFieldIndex].properties.crops;
        for(let subFieldCropIndex in subFieldCropsArray){
            if(subFieldCropsArray[subFieldCropIndex].reputation_actions != null){
                reputationMaps.push(subFieldCropsArray[subFieldCropIndex].reputation_actions!)
            }
        }
    }
    
    return reputationMaps
}

// this function should receive a cropId and farmerId which can be used to find the proper SubFieldCrop
// once found, we can set the action value to that of actionStatus arg.
export function UpdateReputationActions(
    field: Field, 
    cropId: string, 
    farmer: string, 
    actionName: string, 
    actionStatus: boolean): Field{

        const subFieldsArray: SubField[] = field.subFields;
        for(let subFieldIndex in subFieldsArray){
            const subFieldCropsArray: SubFieldCrop[] = subFieldsArray[subFieldIndex].properties.crops;
            for(let subFieldCropIndex in subFieldCropsArray){
                if(subFieldCropsArray[subFieldCropIndex].crop._id?.toString() === cropId &&
                subFieldCropsArray[subFieldCropIndex].farmer === farmer &&
                subFieldCropsArray[subFieldCropIndex].reputation_actions
                ){
                    subFieldCropsArray[subFieldCropIndex].reputation_actions![actionName] = actionStatus;
                }
            }
        }
    return field;
}