import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesreturnService {
    private readonly _HttpClient = inject(HttpClient)

    getAllSalesReturn():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Returns/GetAllReturns`)
    }

    getSalesReturnById(id:number):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Returns/GetReturnById/${id}`)
    }

    createSalesReturn(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Returns/CreateReturns`, data)
    }

    deleteSalesReturn(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Returns/DeleteReturn/${id}`)
    }
}
