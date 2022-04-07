import commonInjectableContainer from "./inversify.config";
import { CropService, ICropService } from "../../services/CropService";
import TYPES from "./inversify.types";
import { FormService, IFormService } from "../../helpers/FormService";

export class DependencyLoader {

    public load(): void {
        commonInjectableContainer.bind<ICropService>(TYPES.CropService).to(CropService).inSingletonScope();
        commonInjectableContainer.bind<IFormService>(TYPES.FormService).to(FormService).inSingletonScope();
    }

}