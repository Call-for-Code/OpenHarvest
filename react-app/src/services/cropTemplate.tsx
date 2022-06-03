import axios from 'axios'
// import { EISField, FieldResponse } from '../types/EIS';

export interface CropTemplate {
    _id?: string,
    action_a_weight: number,
    action_b_weight: number,
    action_c_weight: number,
    action_d_weight: number,
    crop_template_id: string
}


export class CropTemplateAPI{
    APIBase = "/api/weights/";
    
    async getAllCropTemplates(): Promise<CropTemplate> {
        const data = await axios.get<CropTemplate>(this.APIBase + "getCropTemplate");
        return data.data;
    }

    async getCropTemplateByName(cropTemplateName: string): Promise<CropTemplate> {
        const data = await axios.get<CropTemplate>(this.APIBase + "getCropTemplateByName/" + cropTemplateName);
        return data.data;
    }
    
    async deleteCropTemplateByName(cropTemplateName: string): Promise<CropTemplate> {
        const data = await axios.delete<CropTemplate>(this.APIBase + "deleteCropTemplateByName/" + cropTemplateName);
        return data.data;
    }

    async putCropTemplate(cropTemplateObject: CropTemplate): Promise<CropTemplate> {
        const data = await axios.put<CropTemplate>(this.APIBase + "put", cropTemplateObject);
        return data.data
    }
}