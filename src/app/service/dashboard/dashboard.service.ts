import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private readonly _HttpClient = inject(HttpClient)

    GetTopCategorySelling():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Dashboard/GetTopCategorySelling`)
    }

    SummaryReport():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Dashboard/SummaryReport`)
    }

    ChartDashboard(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Dashboard/ChartDashboard`, data)
    }
}
