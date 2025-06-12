import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    private readonly _HttpClient = inject(HttpClient)

    getAllCategory():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Category/GetAllCategories`)
    }

    getAllCategoryById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Category/GetCategoryById/${id}`)
    }

    createCategory(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Category/CreateCategory`, data)
    }

    updateCategory(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Category/UpdateCategory/${id}`, data)
    }

    deleteCategory(id:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Category/DeleteCategory/${id}`)
    }
}
