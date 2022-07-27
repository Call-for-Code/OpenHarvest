import axios from 'axios'
import { Crop } from './crops'

export interface CropTemplate{
    _id?: string,
    action_weights: Record<string, string>,
    crop_template_name: string,
    max_payout: number
}

export class CropTemplateAPI{
    APIBase = "/api/cropTemplates/";
    
    async getAllCropTemplates(): Promise<CropTemplate> {
        const data = await axios.get<CropTemplate>(this.APIBase + "getCropTemplates");
        return data.data;
    }

    async getCropTemplateByName(crop_template_name: string): Promise<CropTemplate> {
        const data = await axios.get<CropTemplate>(this.APIBase + "getCropTemplateByName/" + crop_template_name);
        return data.data;
    }
    
    async deleteCropTemplateByName(crop_template_name: string): Promise<CropTemplate> {
        const data = await axios.delete<CropTemplate>(this.APIBase + "deleteCropTemplateByName/" + crop_template_name);
        return data.data;
    }

    async putCropTemplate(cropTemplateObject: CropTemplate): Promise<CropTemplate> {
        const data = await axios.put<CropTemplate>(this.APIBase + "updateCropTemplate", cropTemplateObject);
        return data.data
    }

    // field services

    async getFieldsforCropId(cropId: string):  Promise<any> {
        const data = await axios.get<any>(this.APIBase + "getFieldsforCropId/" + cropId);
        return data.data;
    }

    async updateRepActions( field: any, 
        cropId: string, 
        farmer: string, 
        actionName: string, 
        actionStatus: boolean): Promise<any> {
        const data = await axios.put<any>(this.APIBase + "updateRepActions", {
            field : field,
            cropId : cropId,
            farmer : farmer,
            actionName : actionName,
            actionStatus : actionStatus
        });
        return data.data
    }

    async addCropTemplateToField(field: any): Promise<any> {
        const data = await axios.put<any>(this.APIBase + "addCropTemplateToField", field);
        return data.data
    }

    async getField(fieldId: string): Promise<any> {
        const data = await axios.get<any>(this.APIBase + "getField/" + fieldId);
        return data.data;
    }
}