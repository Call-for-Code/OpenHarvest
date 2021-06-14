import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './services/database.service';
import { CloudantService } from './services/cloudant.service';
import { LandAreasService } from './services/land-areas.service';
import { LandAreasController } from './controllers/land-areas.controller';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController, LandAreasController],
  providers: [AppService, DatabaseService, CloudantService, LandAreasService],
})
export class AppModule {}
