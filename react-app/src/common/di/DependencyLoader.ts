import commonInjectableContainer from "./inversify.config";
import { CropService, ICropService } from "../../services/CropService";
import TYPES from "./inversify.types";

export class DependencyLoader {

    public load(): void {
        commonInjectableContainer.bind<ICropService>(TYPES.CropService).to(CropService).inSingletonScope();
    }

}