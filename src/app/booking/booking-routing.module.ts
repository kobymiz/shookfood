import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingSearchComponent } from './booking-search/booking-search.component';
import { UpsertWorkshopComponent } from './upsert-workshop/upsert-workshop.component';

const routes: Routes = [{
  path: '', redirectTo: '/booking/search', pathMatch: 'full'
},{
  path: 'search',
  component: BookingSearchComponent
},{
  path: 'details/:id',
  component: BookingDetailsComponent
},{
  path: 'ws/add',
  component: UpsertWorkshopComponent
},{
  path: 'ws/edit/:id',
  component: UpsertWorkshopComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
