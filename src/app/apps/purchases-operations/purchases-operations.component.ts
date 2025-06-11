import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

interface ISalesOperation {
  id: number;
  clientName: string;
  porductName: string;
  details: string;
  quantity: number;
  totalAmount: number;
}


@Component({
  selector: 'app-purchases-operations',
  standalone: true,
  imports: [FormsModule, NgIf, NgSelectModule, ReactiveFormsModule, NgFor],
  templateUrl: './purchases-operations.component.html',
  styleUrl: './purchases-operations.component.css'
})
export class PurchasesOperationsComponent {
 private readonly _FormBuilder = inject(FormBuilder)
    salesOperation: ISalesOperation[] = [
        { id: 1, clientName: 'محمد', porductName: 'عطر رجالي', quantity: 12, totalAmount: 1249, details:'اول عملية بيع'},
        { id: 2, clientName: 'أحمد', porductName: 'اسوارة حريمي', quantity: 52, totalAmount: 320, details:'تاني عملية بيع'},
    ];

    ngOnInit(): void {
        this.addProduct()
    }

    salesOperationFrom:FormGroup = this._FormBuilder.group({
        clientId: ['', Validators.required],
        details: ['', Validators.required],
        products: this._FormBuilder.array([])
    })

    products():FormArray{
        return this.salesOperationFrom.get('products') as FormArray
    }

    addProduct(){
        if(this.products().length < 5){
            const product = this._FormBuilder.group({
                porductId: ['', [Validators.required]],
                salesAmount: ['', [Validators.required]],
                quantity: ['', Validators.required],
                totalAmount: ['', Validators.required],
            })
            this.products().push(product)
        }
    }

    removeProduct(index:number){
        this.products().removeAt(index)
    }

    submitSalesOperationForm():void{
        console.log(this.salesOperationFrom.value);
    }

    filteredSalesOperations: ISalesOperation[] = [...this.salesOperation];
    searchTerm: string = '';
    sortColumn: keyof ISalesOperation = 'clientName';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterSalesOperations() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredSalesOperations = this.salesOperation.filter(supplier => {
            return (
                supplier.clientName.toLowerCase().includes(term) ||
                supplier.porductName.toString().includes(term) ||
                supplier.quantity.toString().includes(term) ||
                supplier.totalAmount.toString().includes(term) ||
                supplier.details.toString().includes(term)
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
    // onEdit(product: ISalesOperation) {
    //     console.log('تعديل الموظف:', product);
    // }
    // onDelete(id: number) {
    //     if (confirm('هل أنت متأكد من الحذف؟')) {
    //         this.salesOperation = this.salesOperation.filter(p => p.id !== id);
    //         this.filterSalesOperations();
    //     }
    // }

    options1 = ['إسلام', 'محمود', 'عماد'];
    options2= ['منتج 1', 'منتج 2', 'منتج 3'];
    input1 = [];
    input2 = [];
}
