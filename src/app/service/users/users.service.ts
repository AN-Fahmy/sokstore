import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    private readonly _HttpClient = inject(HttpClient)

    getAllUsers():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/UserManager/v1/GetAll/GetAll`)
    }

    getUserById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/UserManager/v1/GetById/GetById/${id}`)
    }

    getAllEmployeeAndAdmin():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/UserManager/v1/GetAllEmployeeAndAdmin/GetAllEmployeeAndAdmin`)
    }
}
