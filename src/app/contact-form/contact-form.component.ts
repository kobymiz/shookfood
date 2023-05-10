import { Component } from '@angular/core';
import { ContactService } from './contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {

  contactForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required])
  });
  contactFormSubmitted = false;
  sendingInProgress = false;
  messageSuccess = false;
  messageFailed = false;
  messageFailureErrorMessage = '';

  constructor(private contactService: ContactService) {

  }

  sendMessage() {
    this.sendingInProgress = true;
    this.messageSuccess = false;
    this.messageFailed = false;
    this.contactFormSubmitted = true;

    if (!this.contactForm.valid) {
      this.sendingInProgress = false;
      console.log("Invalid form");
      return;
    }

    var params = this.contactForm.value;

    this.contactService.sendMessage(params).subscribe(response => {
      if (response.status == 0) {
        this.messageSuccess = true;
      } else {
        this.messageFailed = false;
      }
      this.sendingInProgress = false;
    });
  }
}
