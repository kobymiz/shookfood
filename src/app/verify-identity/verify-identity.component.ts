import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-identity',
  templateUrl: './verify-identity.component.html',
  styleUrls: ['./verify-identity.component.css']
})
export class VerifyIdentityComponent {
  @Output() verificationCompleted = new EventEmitter<boolean>();

  showModal: boolean = false;
  verificationForm: FormGroup;
  confirmationCodeSent: boolean = false;
  confirmationCode: FormControl = new FormControl('', Validators.required);
  phoneNumber: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\+?\d+$/)
  ]);

  constructor(private authService: AuthService) {
    this.verificationForm = new FormGroup({
      phoneNumber: this.phoneNumber,
      confirmationCode: this.confirmationCode
    });
  }

  show() {
    this.showModal = true;
  }

  hide() {
    this.showModal = false;
    this.verificationForm.reset();
    this.confirmationCodeSent = false;
  }

  sendConfirmationCode() {
    this.authService.sendConfirmationCode({
      phoneNumber: this.verificationForm.getRawValue().phoneNumber
    }).subscribe((response=>{
      if(response == true){
        this.confirmationCodeSent = true;
      }

    }))

  }
  showCodeField(){
    this.confirmationCodeSent = true;
  }

  confirmCode() {
    var formValue = this.verificationForm.getRawValue();
    this.authService.confirmVerificationCode({
      phoneNumber: formValue.phoneNumber,
      code: formValue.confirmationCode
    }).subscribe((response)=>{
      console.log("response: ", response);
      if(response == true){
        this.verificationCompleted.emit(true);
        this.hide();
      }
    })
  }
}
