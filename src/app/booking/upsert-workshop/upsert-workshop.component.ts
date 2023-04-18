import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Workshop } from '../data-model/booking-data-model';
import { first, take } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-booking-search',
  templateUrl: './upsert-workshop.component.html'
})
export class UpsertWorkshopComponent implements OnInit {
  mode: 'view'|'edit' = 'view';

  id = '';
  data: Workshop | undefined = undefined;

  workshopForm = new FormGroup({
    id: new FormControl('ws-123'),
    name: new FormControl(''),
    description: new FormControl(''),
    longDescription: new FormControl(''),
    cost: new FormControl(0),
    duration: new FormControl(0),
    totalSlots: new FormControl(0),
    imgUrl: new FormControl(''),
  });

  constructor(private route: ActivatedRoute, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {      
      this.id = params.get('id')??'';
      console.log("Workshop id: ", this.id);
      if(this.id){
        this.bookingService.getWorkshopByIdAsync(this.id).subscribe(data=>{
          this.data = data;
          console.log("Data: ", this.data);
          if(this.data){
            if(!this.data.longDescription){
              this.data.longDescription = '';
            }
            this.mode = 'edit';
            this.workshopForm.setValue(this.data);
            console.log("Changed mode from view to edit. Form data: ", this.workshopForm.value);
          }
        });
        
      }      
    })
  }

  upsertWorkshop(){
    var data = this.workshopForm.getRawValue();
    console.log("Upserting Workshop", this.data);
    this.bookingService.upsertWorkshop(data).subscribe(response=>{
      console.log("Upsert result: ", response);
    })    
  }

  resetForm(){

    this.workshopForm.reset();
    if(this.mode=='edit' && this.data){
      this.workshopForm.setValue(this.data);
    }
  }

}
