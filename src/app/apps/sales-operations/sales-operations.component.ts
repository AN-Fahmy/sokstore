import { NgFor, NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { ClientService } from 'src/app/service/client/client.service';
import { ProductService } from 'src/app/service/product/product.service';
import { SalesoperationService } from 'src/app/service/sales-operation/salesoperation.service';
import Swal from 'sweetalert2';

interface ISalesOperation {
  orderId: number;
  clientName: string;
  totelAmount: number;
  discount:number;
  description: string;
  productsName:any;
}

@Component({
  selector: 'app-sales-operations',
  standalone: true,
  imports: [FormsModule, NgIf, NgSelectModule, ReactiveFormsModule, NgFor, NgxCustomModalComponent],
  templateUrl: './sales-operations.component.html',
  styleUrl: './sales-operations.component.css',
})
export class SalesOperationsComponent implements OnInit{
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _SalesoperationService = inject(SalesoperationService)
    private readonly _ClientService = inject(ClientService)
    private readonly _ProductService = inject(ProductService)

    allSalesOperations:any[] = []
    allClients:any[] = []
    allProducts:any[] = []
    saleOperationById:any = {}

    ngOnInit(): void {
        this.getAllSalesOperations()
        this.getAllClients()
        this.getAllProducts()
        this.addProduct()
        this.salesOperationFrom.get('discount')?.valueChanges.subscribe(() => {
            this.calculateTotelAmount();
        });
    }

    getAllSalesOperations():void{
        this._SalesoperationService.getAllSalesOperations().subscribe({
            next:(res)=>{
                this.allSalesOperations = res.data
                this.filteredSalesOperations = [...this.allSalesOperations]
            }
        })
    }

    getAllClients():void{
        this._ClientService.getAllClients().subscribe({
            next:(res)=>{
                this.allClients = res.data
            }
        })
    }

    getAllProducts():void{
        this._ProductService.getAllProducts().subscribe({
            next:(res)=>{
                this.allProducts = res.data
            }
        })
    }

    getProductById(id:number):void{
        this._SalesoperationService.getSaleOperationById(id).subscribe({
            next:(res)=>{
                this.saleOperationById = res.data
            }
        })
    }

    salesOperationFrom:FormGroup = this._FormBuilder.group({
        clientId:[null],
        discount: [null],
        description: [null],
        totelAmount: [{ value: '', disabled: true }],
        products: this._FormBuilder.array([])
    })

    products():FormArray{
        return this.salesOperationFrom.get('products') as FormArray
    }

    addProduct(){
        const product = this._FormBuilder.group({
            productId: ['', Validators.required],
            salesAmount: [{ value: '', disabled: true }, Validators.required],
            quantity: ['', Validators.required],
            totelAmount: [{ value: '', disabled: true }, Validators.required],
        })
        this.products().push(product)
        this.watchProductChanges(this.products().length - 1);
        this.calculateTotelAmount();
    }

    removeProduct(index:number){
        this.products().removeAt(index)
    }

    watchProductChanges(index: number) {
        const productGroup = this.products().at(index);
        productGroup.get('productId')?.valueChanges.subscribe((productId: number) => {
            if (productId) {
            this._ProductService.getProductById(productId).subscribe({
                next: (res) => {
                const product = res.data;
                productGroup.get('salesAmount')?.setValue(product.sellingPrice);

                const qty = productGroup.get('quantity')?.value || 0;
                productGroup.get('totelAmount')?.setValue(qty * product.sellingPrice);

                this.calculateTotelAmount();
                }
            });
            }
        });

        productGroup.get('quantity')?.valueChanges.subscribe((qty: number) => {
            const price = productGroup.get('salesAmount')?.value || 0;
            productGroup.get('totelAmount')?.setValue(qty * price);
            this.calculateTotelAmount();
        });
    }

    calculateTotelAmount() {
        const productsArray = this.products();
        let totalSum = 0;

        productsArray.controls.forEach(product => {
            const total = +product.get('totelAmount')?.value || 0;
            totalSum += total;
        });

        const discount = +this.salesOperationFrom.get('discount')?.value || 0;

        const totalAfterDiscount = totalSum - discount;

        this.salesOperationFrom.get('totelAmount')?.setValue(totalAfterDiscount);
    }

    submitSalesOperationForm():void{
        let data = this.salesOperationFrom.value

        this._SalesoperationService.createSaleOperation(data).subscribe({
            next:(res)=>{
               Swal.fire({
                    title: "تمت عملية البيع بنجاح",
                    icon: "success",
                })
                this.salesOperationFrom.reset()
                this.getAllSalesOperations()
            },
            error:(err)=>{
                Swal.fire({
                    title: err.error.errors[0],
                    icon: "error",
                })
                this.getAllSalesOperations()
            }
        })
    }

    filteredSalesOperations: ISalesOperation[] = [...this.allSalesOperations];
    searchTerm: string = '';
    sortColumn: keyof ISalesOperation = 'clientName';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterSalesOperations() {
        const term = this.searchTerm.trim().toLowerCase();
        this.filteredSalesOperations = this.allSalesOperations.filter(operation => {
            return (
                operation.clientName.toLowerCase().includes(term) ||
                operation.orderId.toString().includes(term)
            );
        });

        this.sort();
    }
    sortBy(column: keyof ISalesOperation) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }
    sort() {
        this.filteredSalesOperations.sort((a, b) => {
            const valueA = a[this.sortColumn];
            const valueB = b[this.sortColumn];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
            return this.sortDirection === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
            return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            }

            return 0;
        });
    }

    customSearchClientFn(term: string, item: any): boolean {
        term = term.toLowerCase();
        return item.fullName.toLowerCase().includes(term) || item.mobile?.toLowerCase().includes(term);
    }
}
