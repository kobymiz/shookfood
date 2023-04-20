import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingSearchComponent } from './booking-search/booking-search.component';
import { UpsertWorkshopComponent } from './upsert-workshop/upsert-workshop.component';

@NgModule({
  declarations: [
    BookingDetailsComponent,
    BookingSearchComponent,
    UpsertWorkshopComponent],
  imports: [
    CommonModule,
    BookingRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BookingModule { }
