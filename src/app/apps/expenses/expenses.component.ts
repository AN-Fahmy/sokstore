import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExpensesService } from 'src/app/service/expenses/expenses.service';
import { SupplierService } from 'src/app/service/supplier/supplier.service';
import Swal from 'sweetalert2';

interface IExpenses {
  id: number;
  amount: string;
  details: string;
  supplierName: string;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _ExpensesService = inject(ExpensesService)
    private readonly _SupplierService = inject(SupplierService)

    p: number = 1;
    totalItem:number = 0
    allExpenses:any[] = []
    allSuppliers:any[] = []
    expenseId:string = ''
    update:boolean = false

    ngOnInit(): void {
        this.getAllSuppliers()
        this.getAllExpenses()
    }

    getAllSuppliers():void{
        this._SupplierService.getAllSuppliers().subscribe({
            next:(res)=>{
                this.allSuppliers = res.data
            }
        })
    }

    getAllExpenses():void{
        this._ExpensesService.getAllExpenses().subscribe({
            next:(res)=>{
                this.allExpenses = res.data
                this.filteredExpenses = [...this.allExpenses]
                this.totalItem = this.allExpenses.length
            }
        })
    }

    expenseForm:FormGroup = this._FormBuilder.group({
        amount:[''],
        details:[''],
        supplierId:[''],
    })

    submitExpenseForm():void{
        let data = this.expenseForm.value

        this._ExpensesService.createExpenses(data).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم إضافة المصروفات بنجاح",
                    icon: "success",
                })
                this.expenseForm.reset()
                this.getAllExpenses()
            }
        })
    }

    deleteExpense(id:number):void{
        this._ExpensesService.deleteExpenses(id).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم حذف المصروفات بنجاح",
                    icon: "success",
                })
                this.getAllExpenses()
            }
        })
    }

    patchExpenseData(expense:any):void{
        this.expenseId = expense.id
        this.expenseForm.patchValue(expense)
        this.update = true
    }

    updateExpense():void{
        let data = this.expenseForm.value
        data.id = this.expenseId

        this._ExpensesService.updateExpenses(this.expenseId, data).subscribe({
            next:(res)=>{
                this.update = false
                Swal.fire({
                    title: "تم تعديل المصروفات بنجاح",
                    icon: "success",
                })
                this.expenseForm.reset()
                this.getAllExpenses()
            }
        })
    }

    filteredExpenses: IExpenses[] = [...this.allExpenses];
    searchTerm: string = '';
    sortColumn: keyof IExpenses = 'amount';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterExpenses() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredExpenses = this.allExpenses.filter(expense => {
            return (
                String(expense.amount).includes(term) ||
                expense.supplierName.toLowerCase().includes(term) ||
                expense.details.toLowerCase().includes(term)
            );
        });

        this.sort();
    }
    sortBy(column: keyof IExpenses) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }

    sort() {
        this.filteredExpenses.sort((a, b) => {
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
