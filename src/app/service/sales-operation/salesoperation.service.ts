import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesoperationService {
    private readonly _HttpClient = inject(HttpClient)

    getAllSalesOperations():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Order/GetAllSalesOperation`)
    }

    getSaleOperationById(id:number):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Order/GetSaleOperationById/${id}`)
    }

    createSaleOperation(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Order/CreateSalesOperation`, data)
    }
}
