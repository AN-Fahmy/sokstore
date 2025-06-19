import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
    private readonly _HttpClient = inject(HttpClient)

    getAllExpenses():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Expenses/GetAllExpenses`)
    }

    getExpensesById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Expenses/GetExpensesById/${id}`)
    }

    createExpenses(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Expenses/CreateExpenses` ,data)
    }

    updateExpenses(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Expenses/UpdateExpenses/${id}`, data)
    }

    deleteExpenses(id:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Expenses/DeleteExpenses/${id}`)
    }
}
