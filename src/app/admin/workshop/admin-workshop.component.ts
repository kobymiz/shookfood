import { combineLatest } from 'rxjs';
import { Workshop, WorkshopSlot } from '../../booking/data-model/booking-data-model';
import { BookingService } from './../../booking/booking.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workshop',
  templateUrl: './admin-workshop.component.html',
})
export class AdminWorkshopComponent implements OnInit {      
  
  workshop: Workshop;
  items: WorkshopSlot[] = [];
  selectedSlot: WorkshopSlot;
  saving = false;
  saveSuccess = false;
  saveError = false;
  constructor(private bookingService: BookingService){

  }

  ngOnInit() {      
    var workshop$ = this.bookingService.getWorkshopByIdAsync('ws-1');
    var slots$ = this.bookingService.getWorkshopSlots('ws-1');

    combineLatest([workshop$, slots$]).subscribe(([workshop, slots])=>{
      console.log("Workshop", workshop);
      console.log("Slots: ", slots);

      this.workshop = workshop!;
      this.items = slots;
    });    
  }  

  onSelectWorkshop(event){
    var ws = this.items.find(ws=>ws.workshopDate==event.target.value);
    console.log("Selected WS: ", ws);

    this.selectedSlot = ws!;
  }

  onSubmit(){

  }

  getWorkshopTitle(workshop, slot){
    return `${workshop.name} - ${slot.workshopDate}`;
  }
}
