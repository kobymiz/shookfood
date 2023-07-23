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

export interface apiResponse{
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = "https://yn7q8zaf2l.execute-api.eu-west-1.amazonaws.com/default";

  private jwtHelper: JwtHelperService;
  private tokenSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient) {
    this.jwtHelper = new JwtHelperService();
    this.tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromLocalStorage());
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

  confirmVerificationCode(request: ConfirmVerificationCodeRequest){
    const url = `${this.apiURL}/verifycode`;

    console.log("Request: ", request);
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
          // Handle the error here, log it, show a notification, etc.
          return throwError(()=>new Error(error));
        })
      );
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('jwtToken');
  }

  private saveTokenToLocalStorage(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  validateToken(token: string): boolean {
    // Use the jwtHelper to validate the token
    return !this.jwtHelper.isTokenExpired(token);
  }

  extractTokenContent(token: string): any {
    // Use the jwtHelper to decode the token and extract its content
    return this.jwtHelper.decodeToken(token);
  }

  setToken(token: string): void {
    this.saveTokenToLocalStorage(token);
    this.tokenSubject.next(token);
  }

  clearToken(): void {
    localStorage.removeItem('jwtToken');
    this.tokenSubject.next(null);
  }
}
