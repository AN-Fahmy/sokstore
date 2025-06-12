import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
    private readonly _HttpClient = inject(HttpClient)

    getAllSuppliers():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Supplier/GetAllSuppliers`)
    }

    getSupplierById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Supplier/GetSupplierById/${id}`)
    }

    updateSupplier(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Supplier/UpdateSupplier/${id}`, data)
    }

    deleteSupplier(id:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Supplier/DeleteSupplier/${id}`)
    }
}
