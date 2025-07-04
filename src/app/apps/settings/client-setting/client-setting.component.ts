import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ClientService } from 'src/app/service/client/client.service';
import Swal from 'sweetalert2';

interface IClient {
  id: number;
  fullName: string;
  address: string;
  mobile: number;
}

@Component({
  selector: 'app-client-setting',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './client-setting.component.html',
  styleUrl: './client-setting.component.css'
})
export class ClientSettingComponent implements OnInit{
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _AuthService = inject(AuthService)
    private readonly _ClientService = inject(ClientService)

    p: number = 1;
    totalItem:number = 0
    allClients:any[] = []
    clientId:string = ''
    update:boolean = false

    ngOnInit(): void {
        this.getAllClients()
    }

    getAllClients():void{
        this._ClientService.getAllClients().subscribe({
            next:(res)=>{
                this.allClients = res.data
                this.filteredClients = [...this.allClients]
                this.totalItem = this.allClients.length
            }
        })
    }

    clientForm:FormGroup = this._FormBuilder.group({
        fullName:[''],
        mobile:[''],
        address:[''],
        roleId:['f24a8661-fcaf-451e-8c99-6d91a33b96d6']
    })

    submitClientForm():void{
        let data = this.clientForm.value
        this._AuthService.register(data).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم إضافة عميل بنجاح",
                    icon: "success",
                })
                this.clientForm.reset()
                this.clientForm.get('roleId')?.setValue('f24a8661-fcaf-451e-8c99-6d91a33b96d6')
                this.getAllClients()
            }
        })
    }

    deleteClient(id:number):void{
        this._ClientService.deleteClient(id).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم حذف العميل بنجاح",
                    icon: "success",
                })
                this.getAllClients()
            }
        })
    }

    patchClientData(client:any):void{
        this.clientId = client.id
        this.clientForm.patchValue(client)
        this.update = true
    }

    updateClient():void{
        let data = this.clientForm.value
        data.id = this.clientId

        this._ClientService.updateClient(this.clientId, data).subscribe({
            next:(res)=>{
                this.update = false
                Swal.fire({
                    title: "تم تعديل العميل بنجاح",
                    icon: "success",
                })
                this.clientForm.reset()
                this.getAllClients()
            }
        })
    }

    filteredClients: IClient[] = [...this.allClients];
    searchTerm: string = '';
    sortColumn: keyof IClient = 'fullName';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterClients() {
        const term = this.searchTerm.trim().toLowerCase();
        this.filteredClients = this.allClients.filter(client => {
            return (
                client.fullName.toLowerCase().includes(term) ||
                client.address.toString().includes(term) ||
                client.mobile.toString().includes(term)
            );
        });

        this.sort();
    }
    sortBy(column: keyof IClient) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }
    sort() {
        this.filteredClients.sort((a, b) => {
            const valueA = a[this.sortColumn];
            const valueB = b[this.sortColumn];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            }

            return 0;
        });
    }
}
