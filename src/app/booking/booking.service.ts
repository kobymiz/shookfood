import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Workshop, WorkshopSlot, APIResponse } from './data-model/booking-data-model';
// Registration input
/* 
{
  "workshopId": "ws-123456",
  "workshopDate": "2026-05-03T16:00:0.511Z",
  "user": {
    "id": "a29ieW1pekB3YWxsYS5jb218S29ieSBNaXpyYWh5",
    "email": "kobymiz@walla.com",
    "name": "Koby Mizrahy",
    "phoneNumber": "054-3899313"
  }
}

*/

// Unregister input
/*
{
  "workshopId": "ws-123456",
  "workshopDate": "2026-05-03T16:00:0.511Z",
  "user": {
    "id": "a29ieW1pekB3YWxsYS5jb218S29ieSBNaXpyYWh5"
  }
}
*/

export interface WorkshopSearchParams {
  startDate?: Date
  endDate?: Date,
  name?: string
}

interface Database{
  workshops: Workshop[];
  workshopSlots: WorkshopSlot[];
}
//const baseUrl="https://51tiqbuuyd.execute-api.eu-west-1.amazonaws.com/workshop";
const baseUrl = "https://h05n2d3h2e.execute-api.eu-west-1.amazonaws.com/default/workshops";

var database:Database = {
  workshops: [    
  ],
  workshopSlots: [
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
  ]
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

    return this.http.get<APIResponse>(baseUrl).pipe(switchMap(response=>{
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
    return this.http.post<APIResponse>(baseUrl, data).pipe(switchMap(response=>{
      console.log("Response: ", response);
      if(response.status == 0){                      
        return of(data);
      }
      console.log("Error occured when getting data from backend");
      return of(data);
    })); 
  }

  public getWorkshopSlots(workshopId: string): WorkshopSlot[]|undefined {
    var data = database.workshopSlots.filter(d=>d.workshopId==workshopId);

    return data;
  }
}

/*
slots: [{
        totalSlots:12,
        availableSlots: 12,
        date: new Date(2023, 5,3,16,0,0),
        users: []
      },
      {
        totalSlots:12,
        availableSlots: 12,
        date: new Date(2023, 5,10,16,0,0),
        users: []
      },{
        totalSlots:12,
        availableSlots: 12,
        date: new Date(2023, 6,3,16,0,0),
        users: []
      },
      {
        totalSlots:12,
        availableSlots: 12,
        date: new Date(2023, 5,10,16,0,0),
        users: []
      }],
*/
