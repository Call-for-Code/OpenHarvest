import { CropTemplate} from "../../../db/entities/cropTemplate";
import { Field, SubField, SubFieldCrop} from "../../../db/entities/field"

// actionWeight * MaxPayout = NumOfHXToPay

export const calculatePayment = (actionWeight, maxPayout) => {
    return Math.floor((actionWeight/100) * maxPayout);
}

// this function should receive a cropId and farmerId which can be used to find the proper SubFieldCrop
// once found, we can set the action value to that of actionStatus arg.
export function UpdateReputationActions(
    field: Field, 
    cropId: string, 
    farmer: string, 
    actionName: string, 
    actionStatus: boolean): [Field, CropTemplate, Boolean]{
        let cropTemplate;
        let statusUpdated = false;
        const subFieldsArray: SubField[] = field.subFields;
        for(let subFieldIndex in subFieldsArray){
            const subFieldCropsArray: SubFieldCrop[] = subFieldsArray[subFieldIndex].properties.crops;
            for(let subFieldCropIndex in subFieldCropsArray){
                if(subFieldCropsArray[subFieldCropIndex].crop._id?.toString() === cropId &&
                (subFieldCropsArray[subFieldCropIndex].farmer === farmer || subFieldCropsArray[subFieldCropIndex].farmer === "") &&
                subFieldCropsArray[subFieldCropIndex].reputation_actions
                ){
                    statusUpdated = (subFieldCropsArray[subFieldCropIndex].reputation_actions![actionName] != actionStatus);
                    subFieldCropsArray[subFieldCropIndex].reputation_actions![actionName] = actionStatus;
                    cropTemplate = subFieldCropsArray[subFieldCropIndex].crop_template!;                    
                }
            }
        }
    return [field, cropTemplate, statusUpdated];
}

const calculateReputationEarned = (reputationActions: Record<string,boolean>, reputationWeights: Record<string, string>) => {
    let totalRepEarned = 0;
    for(const key in reputationActions){
        totalRepEarned += calculatePayment(reputationActions[key], reputationWeights[key]);
    }
    return totalRepEarned;
}

/* 
    given a field, return the max payout and total reputation earned per subfield
    [
        crop_name : {
            id: ...
            max_reputation: ...
            reputation_earned: ...
        },
        ...
    ]
*/
export function getReputationReport(field: Field): any{
    let reputationReportList: Record<string, any>[] = [];
    const subFieldsArray: SubField[] = field.subFields;
    
    for(let subFieldIndex in subFieldsArray){
        const subFieldCropsArray: SubFieldCrop[] = subFieldsArray[subFieldIndex].properties.crops;
        for(let subFieldCropIndex in subFieldCropsArray){
            reputationReportList.push({
                [subFieldCropsArray[subFieldCropIndex].crop.name] : {
                        id : subFieldCropsArray[subFieldCropIndex].crop._id!.toString(),
                        max_reputation : subFieldCropsArray[subFieldCropIndex].crop.crop_template!.max_payout,
                        reputation_earned : calculateReputationEarned(subFieldCropsArray[subFieldCropIndex].reputation_actions!, subFieldCropsArray[subFieldCropIndex].crop.crop_template!.action_weights!)
                }
            });
        }
    }
    return reputationReportList;
}