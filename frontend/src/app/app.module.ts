import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// carbon-components-angular default imports
import {
	IconModule,
	IconService,
	UIShellModule,
	PlaceholderModule,
	ModalModule,
	GridModule,
	ListModule,
	TabsModule,
	TilesModule,
	ButtonModule,
	InputModule,
	TableModule
} from 'carbon-components-angular';

import Notification20 from '@carbon/icons/es/notification/20';
import UserAvatar20 from '@carbon/icons/es/user--avatar/20';
import AppSwitcher20 from '@carbon/icons/es/app-switcher/20';
import { HeaderComponent } from './header/header.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { DocsComponent } from './pages/docs/docs.component';
import { SupportComponent } from './pages/support/support.component';
import { Link1Component } from './pages/link1/link1.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { CropComponent } from './crop/crop.component';
import { AddCropComponent } from './crop/add-crop/add-crop.component';
import { UpdateCropComponent } from './crop/update-crop/update-crop.component';
import { DeleteCropComponent } from './crop/delete-crop/delete-crop.component';
import { LotComponent } from './lot/lot.component';
import { AddLotComponent } from './lot/add-lot/add-lot.component';
import { UpdateLotComponent } from './lot/update-lot/update-lot.component';
import { DeleteLotComponent } from './lot/delete-lot/delete-lot.component';
import { SearchCropComponent } from './crop/search-crop/search-crop.component';
import { SearchLotComponent } from './lot/search-lot/search-lot.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		CatalogComponent,
		DocsComponent,
		SupportComponent,
		Link1Component,
		DashboardComponent,
		LoginComponent,
		FooterComponent,
		RegistrationComponent,
		CropComponent,
		AddCropComponent,
		UpdateCropComponent,
		DeleteCropComponent,
		LotComponent,
		AddLotComponent,
		UpdateLotComponent,
		DeleteLotComponent,
		SearchCropComponent,
		SearchLotComponent
	],
	imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		AppRoutingModule,
		UIShellModule,
		IconModule,
		ModalModule,
		PlaceholderModule,
		GridModule,
		ListModule,
		TabsModule,
		TilesModule,
		ButtonModule,
		InputModule,
		HttpClientModule,
		TableModule,
		ReactiveFormsModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(protected iconService: IconService) {
		iconService.registerAll([
			Notification20,
			UserAvatar20,
			AppSwitcher20
		]);
	}
}
