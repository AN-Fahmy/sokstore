import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from 'src/app/service/auth/auth.service';
import { EmployeeService } from 'src/app/service/employee/employee.service';
import Swal from 'sweetalert2';

interface IEmployee {
  id: number;
  fullName: string;
  mobile: number;
  address: string;
  username: string;
  password: string;
  role:string
}

@Component({
  selector: 'app-employee-setting',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './employee-setting.component.html',
  styleUrl: './employee-setting.component.css'
})
export class EmployeeSettingComponent implements OnInit {
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _AuthService = inject(AuthService)
    private readonly _EmployeeService = inject(EmployeeService)

    p: number = 1;
    totalItem:number = 0
    allEmpolyees:any[] = []
    employeeId:string = ''
    update:boolean = false
    ngOnInit(): void {
        this.getAllEmployee()
    }

    getAllEmployee():void{
        this._EmployeeService.getAllEmployee().subscribe({
            next:(res)=>{
                this.allEmpolyees = res.data
                this.filteredEmployees = [...this.allEmpolyees]
                this.totalItem = this.allEmpolyees.length
            }
        })
    }

    employeeForm:FormGroup = this._FormBuilder.group({
        fullName: [''],
        mobile: [''],
        address: [''],
        username: [''],
        password: [''],
        roleId: ['defae231-46fe-4deb-ba49-903c6578e1a6'],
    })

    submitEmployeeForm():void{
        let data = this.employeeForm.value
        this._AuthService.register(data).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم إضافة موظف بنجاح",
                    icon: "success",
                })
                this.employeeForm.reset()
                this.employeeForm.get('roleId')?.setValue('defae231-46fe-4deb-ba49-903c6578e1a6')
                this.getAllEmployee()
            }
        })
    }

    deleteEmployee(id:number):void{
        this._EmployeeService.deleteEmployee(id).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم حذف موظف بنجاح",
                    icon: "success",
                })
                this.getAllEmployee()
            }
        })
    }

    pathEmployeeData(employee:any):void{
        this.employeeId = employee.id
        this.employeeForm.patchValue(employee)
        this.update = true
    }

    updateEmployee():void{
        let data = this.employeeForm.value
        data.id = this.employeeId

        this._EmployeeService.updateEmployee(this.employeeId, data).subscribe({
            next:(res)=>{
                this.update = false
                Swal.fire({
                    title: "تم تعديل الموظف بنجاح",
                    icon: "success",
                })
                this.employeeForm.reset()
                this.getAllEmployee()
            }
        })
    }

    filteredEmployees: IEmployee[] = [...this.allEmpolyees];
    searchTerm: string = '';
    sortColumn: keyof IEmployee = 'fullName';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterEmployees() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredEmployees = this.allEmpolyees.filter(employee => {
            return (
                employee.fullName.toLowerCase().includes(term) ||
                employee.address.toString().includes(term) ||
                employee.mobile.toString().includes(term) ||
                employee.username.toString().includes(term)
            );
        });

        this.sort();
    }
    sortBy(column: keyof IEmployee) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }

    sort() {
        this.filteredEmployees.sort((a, b) => {
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
