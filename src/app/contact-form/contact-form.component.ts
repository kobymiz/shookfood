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

  constructor(private contactService: ContactService){

  }

  sendMessage(){
    this.contactFormSubmitted = true;
    if(!this.contactForm.valid){
      console.log("Invalid form")
      return;
    }

    var params = this.contactForm.value;

    this.contactService.sendMessage(params).subscribe(response=>{
      console.log("Send message response: ", response);
    });
  }
}
