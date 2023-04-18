import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Workshop } from '../data-model/booking-data-model';
import { first, take } from 'rxjs/operators';

@Component({
  selector: 'app-booking-search',
  templateUrl: './booking-search.component.html',
  styleUrls: ['./booking-search.component.css']
})
export class BookingSearchComponent implements OnInit {

  constructor(private bookingService: BookingService) { }

  workshops: Workshop[] = [];

  ngOnInit(): void {
    this.bookingService.getWorkshops({}).pipe(take(1)).subscribe(data=>{
      this.workshops = data;
      console.log("Data: ", data);
    });
  }

}
