import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BookingService } from '../booking.service';
import { Workshop, WorkshopSlot } from '../data-model/booking-data-model';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private bookingService: BookingService) { }

  id: string = '';
  data: Workshop|undefined = undefined;
  slots: WorkshopSlot[] | undefined = undefined;

  viewMode: 'details'|'registration' = 'details';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id')??'';
      if(this.id){
        this.bookingService.getWorkshopByIdAsync(this.id).subscribe(data=>{
          this.data = data;
        });
        this.slots= this.bookingService.getWorkshopSlots(this.id);
      }
    })
  }

}
