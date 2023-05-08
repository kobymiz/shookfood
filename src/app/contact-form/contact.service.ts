import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { APIResponse } from '../booking/data-model/booking-data-model';

export interface SendMessageParams {
  fullName: string
  emailAddress: string
  phoneNumber: string
  body: string
}

const baseUrl = "https://h05n2d3h2e.execute-api.eu-west-1.amazonaws.com/default/send-message";


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http:HttpClient) {
  }

  public sendMessage(params: SendMessageParams): Observable<APIResponse>{
    console.log("sendMessage user", params);

    var message = `Full name: ${params.fullName}
                   Email: ${params.emailAddress}
                   Phone Number: ${params.phoneNumber}
                   Message: ${params.body}`;
    var payload = {
      subject: "Contact Form Message",
      message: message
    }

    return this.http.post<APIResponse>(baseUrl, payload).pipe(switchMap(response=>{
      console.log("Response: ", response);
      if(response.status == 0){
        return of(response);
      }
      console.log("Error occured when getting data from backend");
      return of(response);
    }));
  }
}
