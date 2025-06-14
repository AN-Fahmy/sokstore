import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from 'src/app/service/category/category.service';
import { InventoryService } from 'src/app/service/inventory/inventory.service';
import { ProductService } from 'src/app/service/product/product.service';
import Swal from 'sweetalert2';

interface IProduct {
  id: number;
  name: string;
  warehouseName: string;
  categoryName: string;
  unitName: string;
  description:string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-product-setting',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './product-setting.component.html',
  styleUrl: './product-setting.component.css'
})
export class ProductSettingComponent {
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _ProductService = inject(ProductService)
    private readonly _InventoryService = inject(InventoryService)
    private readonly _CategoryService = inject(CategoryService)

    allProducts:any[] = []
    allCategories:any[] = []
    allInventories:any[] = []
    productId:string = ''
    clientId:string = ''
    update:boolean = false

    ngOnInit(): void {
        this.getAllProducts()
        this.getAllCategory()
        this.getAllInventory()
    }

    getAllCategory():void{
        this._CategoryService.getAllCategory().subscribe({
            next:(res)=>{
                this.allCategories = res.data
            }
        })
    }

    getAllInventory():void{
        this._InventoryService.getAllWarehouses().subscribe({
            next:(res)=>{
                this.allInventories = res.data
            }
        })
    }

    getAllProducts():void{
        this._ProductService.getAllProducts().subscribe({
            next:(res)=>{
                this.allProducts = res.data
                this.filteredProducts = [...this.allProducts]
            }
        })
    }

    productForm:FormGroup = this._FormBuilder.group({
        name:[''],
        warehouseId:[''],
        categoryId:[''],
        units:[''],
        description:[''],
        purchasePrice:[''],
        sellingPrice:[''],
        quantity:['']
    })

    submitProductForm():void{
        let data = this.productForm.value
        data.units = +data.units

        this._ProductService.createProducts(data).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم إضافة منتج بنجاح",
                    icon: "success",
                })
                this.productForm.reset()
                this.getAllProducts()
            }
        })
    }

    deleteProduct(id:number):void{
        this._ProductService.deleteProduct(id).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم حذف المنتج بنجاح",
                    icon: "success",
                })
                this.getAllProducts()
            }
        })
    }

    patchProductData(product:any):void{
        let data = product
        data.units = product.unitId
        this.productId = product.id
        this.productForm.patchValue(data)
        this.update = true
    }

    updateProduct():void{
        let data = this.productForm.value
        data.id = this.productId
        data.units = +data.units

        this._ProductService.updateProduct(this.productId, data).subscribe({
            next:(res)=>{
                this.update = false
                Swal.fire({
                    title: "تم تعديل المنتج بنجاح",
                    icon: "success",
                })
                this.productForm.reset()
                this.getAllProducts()
            }
        })
    }

    filteredProducts: IProduct[] = [...this.allProducts];
    searchTerm: string = '';
    sortColumn: keyof IProduct = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterProducts() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredProducts = this.allProducts.filter(product => {
            return (
                product.name.toLowerCase().includes(term) ||
                product.warehouseName.toLowerCase().includes(term) ||
                product.categoryName.toLowerCase().includes(term)
            );
        });

        this.sort();
    }

    sortBy(column: keyof IProduct) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }

    sort() {
        this.filteredProducts.sort((a, b) => {
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
}
