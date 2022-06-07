import axios from 'axios'

export interface CropTemplate{
    _id?: string,
    action_weights: Record<string, string>,
    crop_template_name: string,
}

export class CropTemplateAPI{
    APIBase = "/api/cropTemplates/";
    
    async getAllCropTemplates(): Promise<CropTemplate> {
        const data = await axios.get<CropTemplate>(this.APIBase + "getCropTemplate");
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
        console.log("cropTemplateObject from service: ", cropTemplateObject)
        const data = await axios.put<CropTemplate>(this.APIBase + "put", cropTemplateObject);
        return data.data
    }
}