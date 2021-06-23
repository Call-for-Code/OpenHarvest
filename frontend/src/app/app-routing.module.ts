import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCropComponent } from './crop/search-crop/search-crop.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LotAssignmentComponent } from "./lot/lot-assignment/lot-assignment.component";
import { LandAreasComponent } from "./pages/land-areas/land-areas.component";
import { RecommendationComponent } from './recommendation/recommendation.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'recommendation',
		component: RecommendationComponent
	},
	{
		path: 'lot-assignment',
		component: LotAssignmentComponent
	},
	{
		path: 'land-areas',
		component: LandAreasComponent
	},
	{
		path: 'crop',
		component: SearchCropComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
