import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { InventoryService } from 'src/app/service/inventory/inventory.service';
import { UsersService } from 'src/app/service/users/users.service';
import Swal from 'sweetalert2';

interface Iinventory {
  id: number;
  name: string;
  userName: string;
  address: string;
  phone: number;
}


@Component({
  selector: 'app-inventory-setting',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './inventory-setting.component.html',
  styleUrl: './inventory-setting.component.css'
})
export class InventorySettingComponent implements OnInit{
        private readonly _FormBuilder = inject(FormBuilder)
        private readonly _InventoryService = inject(InventoryService)
        private readonly _UsersService = inject(UsersService)
    p: number = 1;
    totalItem:number = 0
    allInventories:any[] = []
    allUsers:any[] = []
    inventoryId:string = ''
    employeeId:string = ''
    update:boolean = false

    ngOnInit(): void {
        this.getAllInventories()
        this.getAllUsers()
    }
    getAllUsers():void{
        this._UsersService.getAllEmployeeAndAdmin().subscribe({
            next:(res)=>{
                this.allUsers = res.data
            }
        })
    }

    getAllInventories():void{
        this._InventoryService.getAllWarehouses().subscribe({
            next:(res)=>{
                this.allInventories = res.data
                this.filteredInventories = [...this.allInventories]
                this.totalItem = this.allInventories.length
            }
        })
    }

    selectEmployeeId(event:Event){
        let selectId = (event.target as HTMLSelectElement).value
        this.employeeId = selectId
    }

    inventoryForm:FormGroup = this._FormBuilder.group({
        name: [''],
        userId: [''],
        address: [''],
    })

    submitinventoryForm():void{
        let data = this.inventoryForm.value
        this._InventoryService.createWarehouse(data).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم إضافة مخزن بنجاح",
                    icon: "success",
                })
                this.inventoryForm.reset()
                this.getAllInventories()
            }
        })
    }

    deleteInventory(id:number):void{
        this._InventoryService.deleteWarehouse(id).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم حذف المخزن بنجاح",
                    icon: "success",
                })
                this.getAllInventories()
            }
        })
    }

    pathInventoryData(inventory:any):void{
        this.inventoryId = inventory.id
        this.inventoryForm.patchValue(inventory)
        this.update = true
    }

    updateInventory():void{
        let data = this.inventoryForm.value
        data.id = this.inventoryId
        data.userId = this.employeeId
        this._InventoryService.updateWarehouse(this.inventoryId, data).subscribe({
            next:(res)=>{
                this.update = false
                Swal.fire({
                    title: "تم تعديل المخزن بنجاح",
                    icon: "success",
                })
                this.inventoryForm.reset()
                this.getAllInventories()
            }
        })
    }

    filteredInventories: Iinventory[] = [...this.allInventories];
    searchTerm: string = '';
    sortColumn: keyof Iinventory = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterInventories() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredInventories = this.allInventories.filter(inventory => {
            return (
                inventory.name.toLowerCase().includes(term) ||
                inventory.address.toString().includes(term) ||
                inventory.userName.toString().includes(term)
            );
        });

        this.sort();
    }
    sortBy(column: keyof Iinventory) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }

    sort() {
        this.filteredInventories.sort((a, b) => {
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

    onEdit(product: Iinventory) {
        console.log('تعديل المنتج:', product);
    }

    onDelete(id: number) {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            this.allInventories = this.allInventories.filter(p => p.id !== id);
            this.filterInventories();
        }
    }
}
