import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';

export interface SendConfirmationCodeRequest{
  phoneNumber: string;
}

export interface ConfirmVerificationCodeRequest{
  phoneNumber: string;
  code: string;
}

export interface ValidateTokenRequest{
  token: string  
}

export interface apiResponse{
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  private apiURL = "https://yn7q8zaf2l.execute-api.eu-west-1.amazonaws.com/default";
  
  private nextPath: string = '';

  constructor(private http: HttpClient) {}

  setNextPath(nextPath: string) {
    this.nextPath = nextPath;
  } 
  getNextPath(){
    return this.nextPath;
  }

  sendConfirmationCode(request: SendConfirmationCodeRequest){
    const url = `${this.apiURL}/generatecode`;

    return this.http.post<any>(url, request)
      .pipe(
        map(response => {
          console.log("Response:", response )
          if (response.statusCode === 200) {
            return true;
          } else {
            return false;
          }
        }),
        catchError((error) => {
          console.log("Catching error: ", error);
          // Handle the error here, log it, show a notification, etc.
          return throwError(()=>new Error(error));
        })
      );
  }

  verifyConfirmationCode(request: ConfirmVerificationCodeRequest){
    const url = `${this.apiURL}/verifycode`;

    console.log("Request: ", request);
    return this.http.post<any>(url, request)
      .pipe(
        map(response => {
          console.log("Response:", response )
          if (response.statusCode === 200) {
            localStorage.setItem('jwtToken', response.body.token);
            return true;
          } else {
            return false;
          }
        }),
        catchError((error) => {
          // Handle the error here, log it, show a notification, etc.
          return throwError(()=>new Error(error));
        })
      );
  }

  validateToken(request: ValidateTokenRequest) {
    const url = `${this.apiURL}/validatetoken`;

    console.log("Request: ", request);
    return this.http.post<any>(url, request)
      .pipe(
        map(response => {
          console.log("Response:", response )
          if (response.statusCode === 200) {            
            return true;
          } else {
            this.clearToken();
            return false;
          }
        }),
        catchError((error) => {
          // Handle the error here, log it, show a notification, etc.
          console.log("Error calling api: ", error);
          
          return throwError(()=>new Error(error));
        })
      );
  }


  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('jwtToken');
  }

  
  clearToken(): void {
    localStorage.removeItem('jwtToken');    
  }
}
