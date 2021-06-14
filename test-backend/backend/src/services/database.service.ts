import { Injectable } from '@nestjs/common';

import { CloudantService } from "./cloudant.service";

@Injectable()
export class DatabaseService {

    public type: string = "";

    constructor(private cloudantService: CloudantService) {}

    setType(type: string) {
        this.type = type;
    }

    getID(id: string) {
        return this.cloudantService.getID(id, this.type);
    }

    getAll() {
        return this.cloudantService.getAll(this.type);
    }


}
