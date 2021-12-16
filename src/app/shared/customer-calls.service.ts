import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { CityCto } from '../cto/city.cto';
import { CustomerCto } from '../cto/customer.cto';
import { PhoneCallsCto } from '../cto/phone-calls.cto';

@Injectable({
  providedIn: 'root'
})
export class CustomerCallsService {
  readonly baseURL = `http://localhost:51000/api`;

  cities$: CityCto[]  = [];
  customers$: CustomerCto[] = [];
 
  constructor(private http: HttpClient) { }
  async refreshLists() : Promise<CustomerCto[]> {
    this.cities$ = (await this.getCities$().toPromise()) || [];
    this.customers$ = (await this.getCustomers$().toPromise()) || [];
    return this.customers$;
  }

  private getCities$() : Observable<CityCto[]> {
    return this.http.get<CityCto[]>(`${this.baseURL}/cities`)  ;
  }
  private getCustomers$() : Observable<CustomerCto[]> {
    return this.http.get<CustomerCto[]>(`${this.baseURL}/customers`)  ;
  }


  getPhoneCalls$(customerId:number ): Observable<PhoneCallsCto[]>{
     return this.http.get<PhoneCallsCto[]>(`${this.baseURL}/customers/${customerId}`)  ;
  }

}
