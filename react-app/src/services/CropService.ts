import { injectable } from "inversify";
import { Crop } from "./crops";
import axios from "axios";

export interface ICropService {
    findAll: () => Promise<Crop[]>;
    saveCrop: (crop: Crop) => Promise<void>;
    deleteCrop: (id: string) => Promise<void>;
}

@injectable()
export class CropService implements ICropService {

    private readonly baseUrl = "/api/crop";

    findAll(): Promise<Crop[]> {
        return new Promise<Crop[]>((resolve, reject) => {
            axios.get(this.baseUrl)
                .then((res) => {
                    resolve(res.data);
                }).catch(reject);
        });
    }

    saveCrop(crop: Crop): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(this.baseUrl, crop)
                .then(() => {
                    resolve();
                }).catch(reject);
        });
    }

    getCrop(id: string): Promise<Crop> {
        return new Promise<Crop>((resolve, reject) => {
            axios.get(this.baseUrl + "/" + id)
                .then((res) => resolve(res.data))
                .catch(reject);
        });
    }

    updateCrop(crop: Crop): Promise<Crop> {
        return new Promise<Crop>((resolve, reject) => {
            axios.put(this.baseUrl, crop)
                .then((res) => {
                    resolve(res.data);
                }).catch(reject);
        });
    }

    deleteCrop(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.delete(this.baseUrl + "/" + id)
                .then(() => resolve())
                .catch(reject);
        });
    }
}
