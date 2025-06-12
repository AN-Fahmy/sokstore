import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private readonly _HttpClient = inject(HttpClient)

    getAllProducts():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Product/GetAllProducts`)
    }

    getProductById(id:number):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Product/GetProductById/${id}`)
    }

    createProducts(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Product/CreateProduct`, data)
    }

    updateProduct(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Product/UpdateProduct/${id}`, data)
    }

    deleteProduct(id:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Product/DeleteProduct/${id}`)
    }
}
