import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    private readonly _HttpClient = inject(HttpClient)

    getAllClients():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Client/GetAllClients`)
    }

    getClientById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Client/GetClientById/${id}`)
    }

    updateClient(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Client/UpdateClient/${id}`, data)
    }

    deleteClient(id:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Client/DeleteClient/${id}`)
    }
}
