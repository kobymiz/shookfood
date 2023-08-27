import { combineLatest } from 'rxjs';
import { User, Workshop, WorkshopSlot } from '../../booking/data-model/booking-data-model';
import { BookingService } from './../../booking/booking.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workshop',
  templateUrl: './admin-workshop.component.html',
})
export class AdminWorkshopComponent implements OnInit {

  workshop: Workshop;
  items: WorkshopSlot[] = [];
  deleteItems: User[] = [];
  editItems: User[] = [];
  selectedSlot: WorkshopSlot;
  saving = false;
  saveSuccess = false;
  saveError = false;

  editItem: User|undefined;
  origItem: { id: string; fullName: string; phoneNumber: string; email: string; approved: boolean; paid: boolean; regsiterationDate: Date; paymentDate?: string | undefined; paymentMethod?: string | undefined; paymentApprovalNumber?: string | undefined; waitingList: boolean };

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

  onEditUser(user: User){
    this.editItem = user;
    this.origItem = {...user}
  }

  onEndEditUser(user: User){
    this.editItem = undefined;
    if(this.editItems.findIndex(u=>u==user) < 0){
      this.editItems.push(user);
    }

  }

  onCancelEditUser(user: User){
    this.editItem = undefined;
    user = {...this.origItem};
  }

  onSubmit(){
    this.saveError = false;
    this.saveSuccess = false;
    this.saving = true;

    this.bookingService.updateWorkshopSlot(this.selectedSlot).subscribe({
      next: (success)=>{
        this.saving = false;
        this.saveError = !success;
        this.saveSuccess = success;

      },
       error: (error)=>{
        this.saving = false;
        this.saveSuccess = false;
        this.saveError = true;
       }
    });
  }

  getWorkshopTitle(workshop, slot){
    return `${workshop.name} - ${slot.workshopDate}`;
  }
}
