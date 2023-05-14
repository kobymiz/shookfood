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
  data: Workshop | undefined = undefined;
  slots: WorkshopSlot[] | undefined = undefined;
  selectedSlot: WorkshopSlot | undefined = undefined;
  viewMode: 'details' | 'registration' = 'registration';
  registering = false;
  showRegistrationSuccess = false;
  showRegistrationError = false;
  errorMessage = "";
  loadingData = false;
  formModal: any;

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required])
  });

  registerFormSubmitted = false;

  ngOnInit(): void {
    this.loadingData = true;
    this.initModal();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id') ?? '';
      if (this.id) {
        this.bookingService.getWorkshopByIdAsync(this.id).subscribe(data => {
          this.data = data;
        });
        this.bookingService.getWorkshopSlots(this.id).subscribe(data => {
          this.slots = data;
          this.loadingData = false;
        });
      }
    })
  }

  private initModal(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('registerationModal')
    );
    console.log("Form Modal: ", this.formModal);
  }

  startRegistration(slot: WorkshopSlot) {
    this.registerFormSubmitted = false;
    this.selectedSlot = slot;
    this.showRegistrationSuccess = false;
    this.showRegistrationError = false;
    this.errorMessage = '';

    this.formModal.show();
  }

  completeRegistration() {
    this.registering = true;
    this.registerFormSubmitted = true;
    console.log("Registration form:", this.registrationForm.value);

    if (!this.registrationForm.valid) {
      console.log("Registration form is not valid");
      return;
    }

    var formValue = this.registrationForm.value;
    var user: User = {
      id: '',
      fullName: formValue.name??'',
      email: formValue.email??'',
      phoneNumber: formValue.phoneNumber??'',
      paid: false
    };
    if (this.data != undefined && this.selectedSlot != undefined) {
      this.bookingService.register(this.data, this.selectedSlot, user).subscribe(data => {
        console.log("Registration status: ", data);
        if (data.status == 0) {
          this.showRegistrationSuccess = true;
          this.showRegistrationError = false;
        } else {
          this.showRegistrationSuccess = false;
          this.showRegistrationError = true;
          switch (data.status) {
            case -2:
              this.errorMessage = "לא קיימת סדנא בתאריך זה";
              break;
            case -3:
              this.errorMessage = "את/ה כבר רשום לסדנא זו. במידה וברצונך לרשום אדם נוסף, אנא מלא את השם ומספר הטלפון של אותו אדם";
              break;
            case -4:
              this.errorMessage = "אנחנו מתנצלים, אבל סדנא זו כבר מלאה...";
              break;
            case -5:
              this.errorMessage = "אירעה שגיאה במהלך ההרשמה. אנא צור איתנו קשר טלפוני או באמצעות ווטסאפ לצורך השלמת ההרשמה";
              break;
          }
        }
        this.registering = false;
      })
    }

  }


}
