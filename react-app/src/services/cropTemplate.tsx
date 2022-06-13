import axios from 'axios'
import { Crop } from './crops'
import { Field } from '../../../backend/src/db/entities/field'

export interface CropTemplate{
    _id?: string,
    action_weights: Record<string, string>,
    crop_template_name: string,
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

    async getFieldsforCropId(cropId: string):  Promise<Field[]> {
        const data = await axios.get<Field[]>(this.APIBase + "getFieldsforCropId/" + cropId);
        return data.data;
    }

    async putField(field: Field): Promise<Field> {
        const data = await axios.put<Field>(this.APIBase + "updateField", field);
        return data.data
    }

    async getActionsForField(fieldId: string): Promise<Field> {
        const data = await axios.get<Field>(this.APIBase + "getActionsForField/" + fieldId);
        return data.data;
    }
}