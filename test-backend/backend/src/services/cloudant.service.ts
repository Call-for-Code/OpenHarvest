import { CloudantV1 } from "@ibm-cloud/cloudant";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudantService {

    db: string

    constructor(private configService: ConfigService) {
        this.db = this.configService.get<string>("CLOUDANT_DATABASE");
    }

    private client = CloudantV1.newInstance({});

    getAll(partitionKey: string) {
        return this.client.postPartitionAllDocs({
            db: this.db,
            partitionKey,
            includeDocs: true
        })
    }

    getID(id: string, partitionKey?: string) {
        const docId = partitionKey ? `${partitionKey}:${id}` : id;
        return this.client.getDocument({
            db: this.db,
            docId
        });
    }

    // Upsert Document
    createOrUpdateDocument(doc: CloudantV1.Document) {
        return this.client.postDocument({
            db: this.db,
            document: doc
        })
    }

}
