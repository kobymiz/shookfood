import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BookingService } from '../booking.service';
import { Workshop, WorkshopSlot } from '../data-model/booking-data-model';

declare var window: any;

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

  viewMode: 'details'|'registration' = 'registration';

  formModal: any;
  ngOnInit(): void {

    this.initModal();

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

  private initModal():void{
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('registerationModal')
    );
    console.log("Form Modal: ", this.formModal);
  }

  openModal(){
    this.formModal.show();
  }

  closeModal(){
    this.formModal.hide();
  }

}
