import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Workshop, WorkshopSlot, APIResponse, User } from './data-model/booking-data-model';

export interface WorkshopSearchParams {
  startDate?: Date
  endDate?: Date,
  name?: string
}

interface Database{
  workshops: Workshop[];
}

const baseUrl = "https://h05n2d3h2e.execute-api.eu-west-1.amazonaws.com/default";
const wsUrl = baseUrl + "/workshops";
const wsSlotsUrl = baseUrl + "/ws-slots";
const registerUrl = baseUrl + "/register";

var database:Database = {
  workshops: []
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private workshopsLoaded = false;

  constructor(private http:HttpClient) {
  }

  public getWorkshops(searchParams: WorkshopSearchParams): Observable<Workshop[]> {
    if(this.workshopsLoaded){
      return of(database.workshops)
    }

    return this.http.get<APIResponse>(wsUrl).pipe(switchMap(response=>{
      console.log("Response: ", response);
      if(response.status == 0){

        var data:Workshop[] = [...response.data.items];
        return of(data);
      }
      console.log("Error occured when getting data from backend");
      return of([]);
    }), tap(data=>{
      console.log("Data: ", data);
      this.workshopsLoaded = true;
      database.workshops = data;
    }));
  }

  public getWorkshopById(id: string): Workshop|undefined {
    var data = database.workshops.find(d=>d.id==id);

    return data;
  }

  public getWorkshopByIdAsync(id: string): Observable<Workshop|undefined> {
    return this.getWorkshops({}).pipe(switchMap(data=>{
      var ws = this.getWorkshopById(id);
      return of(ws);
    }));
  }

  public upsertWorkshop(data: Workshop){
    return this.http.post<APIResponse>(wsUrl, data).pipe(switchMap(response=>{
      console.log("Response: ", response);
      if(response.status == 0){
        return of(data);
      }
      console.log("Error occured when getting data from backend");
      return of(data);
    }));
  }

  public getWorkshopSlots(workshopId: string): Observable<WorkshopSlot[]> {
    return this.http.get<APIResponse>(wsSlotsUrl + "?workshopId=" + workshopId).pipe(switchMap(response=>{
      console.log("Response: ", response);
      if(response.status == 0){
        var data:WorkshopSlot[] = [...response.data.items];
        return of(data);
      }
      console.log("Error occured when getting data from backend");
      return of([]);
    }), tap(data=>{
      console.log("Data: ", data);
    }));
  }

  public register(workshop:Workshop, slot: WorkshopSlot, user: User): Observable<APIResponse>{
    console.log("Registered user", {workshop,slot, user});

    var payload = {
      workshopId: slot.workshopId,
      workshopDate: slot.workshopDate,
      user
    }

    return this.http.post<APIResponse>(registerUrl, payload).pipe(switchMap(response=>{
      console.log("Response: ", response);
      if(response.status == 0){
        return of(response);
      }
      console.log("Error occured when getting data from backend");
      return of(response);
    }));
  }
}


/*
{
      workshopId: 'ws-1',
      slot: {
        totalSlots: 12,
        availableSlots: 3,
        date: new Date(2023, 5, 3, 16, 0, 0),
        users: []
      }
    },
    {
      workshopId: 'ws-1',
      slot: {
        totalSlots: 12,
        availableSlots: 12,
        date: new Date(2023, 5, 10, 16, 0, 0),
        users: []
      }
    },
    {
      workshopId: 'ws-1',
      slot: {
        totalSlots: 12,
        availableSlots: 12,
        date: new Date(2023, 6, 3, 16, 0, 0),
        users: []
      }
    },
    {
      workshopId: 'ws-1',
      slot: {
        totalSlots: 12,
        availableSlots: 6,
        date: new Date(2023, 6, 10, 16, 0, 0),
        users: []
      }
    },
    {
      workshopId: 'ws-2',
      slot: {
        totalSlots: 12,
        availableSlots: 0,
        date: new Date(2023, 5, 3, 16, 0, 0),
        users: []
      }
    },
    {
      workshopId: 'ws-2',
      slot: {
        totalSlots: 12,
        availableSlots: 12,
        date: new Date(2023, 5, 10, 16, 0, 0),
        users: []
      }
    },
    {
      workshopId: 'ws-2',
      slot: {
        totalSlots: 12,
        availableSlots: 12,
        date: new Date(2023, 6, 3, 16, 0, 0),
        users: []
      }
    },
    {
      workshopId: 'ws-2',
      slot: {
        totalSlots: 12,
        availableSlots: 12,
        date: new Date(2023, 6, 10, 16, 0, 0),
        users: []
      }
    },
*/
