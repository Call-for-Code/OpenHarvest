import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { DocsComponent } from './pages/docs/docs.component';
import { SupportComponent } from './pages/support/support.component';
import { Link1Component } from './pages/link1/link1.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandAreasComponent } from "./pages/land-areas/land-areas.component";
import { RecommendationComponent } from './recommendation/recommendation.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent
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
		path: 'land-areas',
		component: LandAreasComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
