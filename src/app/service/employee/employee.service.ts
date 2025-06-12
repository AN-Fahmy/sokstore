import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
    private readonly _HttpClient = inject(HttpClient)

    getAllEmployee():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Employee/GetAllEmployee`)
    }

    getAllEmployeeById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Employee/GetEmployeeById/${id}`)
    }

    updateEmployee(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Employee/UpdateEmployee/${id}`, data)
    }

    deleteEmployee(id:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Employee/DeleteEmployee/${id}`)
    }
}
