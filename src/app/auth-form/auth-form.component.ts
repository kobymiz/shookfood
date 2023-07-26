import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent {
  phoneNumber: string;
  code: string;
  
  isCodeSent: boolean = false;
  sendCodeError: boolean = false;
  showCodeSentMessage: boolean = false;

  isCodeVerified: boolean = false;
  verifyCodeError: boolean = false;

  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  sendConfirmationCode() {
    this.isLoading = true;
    this.authService.sendConfirmationCode({phoneNumber: this.phoneNumber}).subscribe({      
        next: (success)=>{
          if(success){
            this.isCodeSent = true;    
            this.sendCodeError = false;
            this.showCodeSentMessage = true;
            this.isLoading = false;            
          } else{
            this.isLoading = false;
            this.isCodeSent = false;    
            this.sendCodeError = true;
          }                        
        },
        error: (error)=>{
            console.error('Failed to send confirmation code', error);
            this.isLoading = false;
            this.isCodeSent = false;    
            this.sendCodeError = true;
        }
    }      
    ); 
  }

  verifyCode() {
    this.isLoading = true;
    this.authService.verifyConfirmationCode({phoneNumber: this.phoneNumber, code: this.code}).subscribe(
      (success) => {
        if(success){
          this.isLoading = false;
          this.isCodeVerified = true;         
          this.verifyCodeError = false;
        } else{
          this.isLoading = false;
          this.isCodeVerified = false;
          this.verifyCodeError = true;
        }      

        var nextPath = this.authService.getNextPath();
        if(nextPath){
          this.router.navigate([nextPath]);
        }
        
      },
      (error) => {
        console.error('Code verification failed', error);
        this.isLoading = false;
        this.isCodeVerified = false;
        this.verifyCodeError = true;
      }
    );
  }
}
