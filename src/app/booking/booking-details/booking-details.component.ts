import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BookingService } from '../booking.service';
import { User, Workshop, WorkshopSlot } from '../data-model/booking-data-model';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';

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
  selectedSlot: WorkshopSlot|undefined = undefined;

  viewMode: 'details'|'registration' = 'registration';

  formModal: any;

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    participantsNumber: new FormControl(1)
  });

  registerFormSubmitted = false;

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

  startRegistration(slot:WorkshopSlot){
    this.registerFormSubmitted = false;
    this.selectedSlot = slot;
    this.formModal.show();
  }

  completeRegistration(){
    this.registerFormSubmitted = true;
    console.log("Registration form:", this.registrationForm);
    if(!this.registrationForm.valid){
      console.log("Registration form is not valid");
      return;
    }

    var formValue = this.registrationForm.value;
    var user: User = {
      fullName:formValue.name,
      email: formValue.email,
      phoneNumber:formValue.phoneNumber,
      participantsNumber: formValue.participantsNumber,
      paid: false
    };
    if(this.data != undefined && this.selectedSlot!=undefined){
      this.bookingService.register(this.data, this.selectedSlot, user).subscribe(data=>{
        console.log("Registration status: ", data);
        if(data.status==0){
          this.formModal.hide();
        }
      })
    }

  }


}
