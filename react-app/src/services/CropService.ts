import { injectable } from "inversify";
import { Crop } from "./crops";
import axios from "axios";

export interface ICropService {
    findAll: () => Promise<Crop[]>;
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

}