import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
    private readonly _HttpClient = inject(HttpClient)

    getAllWarehouses():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Warehouse/GetAllWarehouses`)
    }

    getWarehouseById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Warehouse/GetWarehouseById/${id}`)
    }

    createWarehouse(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Warehouse/CreateWarehouse`, data)
    }

    updateWarehouse(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Warehouse/UpdateWarehouse/${id}`, data)
    }

    deleteWarehouse(id:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Warehouse/DeleteWarehouse/${id}`)
    }
}
