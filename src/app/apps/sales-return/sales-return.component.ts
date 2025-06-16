import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SalesoperationService } from 'src/app/service/sales-operation/salesoperation.service';
import { SalesreturnService } from 'src/app/service/salesreturn/salesreturn.service';
import Swal from 'sweetalert2';

// interface ISaleProduct {
//   productId: number;
//   porductName: string;
//   quantity: number;
//   totalAmount: number;
// }

// interface ISalesOperation {
//   id: number;
//   clientName: string;
//   products: ISaleProduct[];
//   details: string;
// }

@Component({
  selector: 'app-sales-return',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './sales-return.component.html',
  styleUrl: './sales-return.component.css'
})

export class SalesReturnComponent implements OnInit{
    private readonly _SalesoperationService = inject(SalesoperationService)
    private readonly _SalesreturnService = inject(SalesreturnService)

    allSalesOperations:any[] = []
    allSalesReturn:any[] = []
    selectedInvoiceId!: number;
    selectedInvoice?: any;
    returnQuantity: number = 0;
    returnsHistory: any[] = [];

    getAllSalesoperations():void{
        this._SalesoperationService.getAllSalesOperations().subscribe({
            next:(res)=>{
                this.allSalesOperations = res.data
            }
        })
    }

    getAllSalesReturn():void{
        this._SalesreturnService.getAllSalesReturn().subscribe({
            next:(res)=>{
                this.allSalesReturn = res.data
            }
        })
    }

    ngOnInit(): void {
        this.getAllSalesoperations()
        this.getAllSalesReturn()
    }

    onInvoiceChange() {
        this._SalesoperationService.getSaleOperationById(this.selectedInvoiceId).subscribe({
            next:(res)=>{
                this.selectedInvoice = res.data
            }
        })
    }

    deleteSalesReturn(id:number):void{
        this._SalesreturnService.deleteSalesReturn(id).subscribe({
            next:(res)=>{
                Swal.fire({
                    title:'تم حذف المرتجع بنجاح',
                    icon: 'success'
                })
                this.getAllSalesReturn()
            }
        })
    }

    // returnWholeInvoice() {
    //     if (!this.selectedInvoice) return;

    //     this.selectedInvoice.products.forEach((product:any) => {
    //         this.returnsHistory.push({
    //             productId: product.productId,
    //             quantity: product.quantity,
    //         });

    //     });

    //      let data = {
    //         orderId : this.selectedInvoiceId,
    //         returnAll: true,
    //         reason : '',
    //         products: this.returnsHistory
    //     }
    //     this._SalesreturnService.createSalesReturn(data).subscribe({
    //         next:(res)=>{
    //             Swal.fire({
    //                 title: 'تم تسجيل الإرتجاع بنجاح',
    //                 icon:'success'
    //             })
    //             this.onInvoiceChange();
    //         },
    //         error:(err)=>{
    //             Swal.fire({
    //                 title: 'حدث خطأ في الإرتجاع',
    //                 icon:'error'
    //             })
    //         }
    //     })
    // }

    toggleReturnInput(product: any & { showReturnInput?: boolean, returnQty?: number }) {
        product.showReturnInput = !product.showReturnInput;
        product.returnQty = 0;
    }

    confirmReturn(invoiceId: number, product: any & { returnQty?: number }) {
        if(product.returnQty){
            this.returnsHistory.push({
                productId: product.productId,
                quantity: product.returnQty,
            });
        } else {
            Swal.fire({
                title:'يجب تحديد منتجات صحيحة للإرجاع',
                icon:'error'
            })
        }

        let data = {
            orderId : invoiceId,
            returnAll: false,
            reason : '',
            products: this.returnsHistory
        }

        this._SalesreturnService.createSalesReturn(data).subscribe({
            next:(res)=>{
                Swal.fire({
                    title:'تم تسجيل المرتجع بنجاح',
                    icon:'success'
                })
                this.getAllSalesReturn()
                this.returnsHistory = [];
                product.showReturnInput = false;
                product.returnQty = 0;
            },
            error:(err)=>{
                Swal.fire({
                    title:err.errors.error,
                    icon:'error'
                })
            }
        })
    }

   returnSelectedItems() {
        if (!this.selectedInvoice) return;

        const validReturns = this.selectedInvoice.products
            .filter((product: any) => {
            const returnQty = product.returnQty;
            return returnQty && returnQty > 0 && returnQty <= product.quantity;
            })
            .map((product: any) => {
            return {
                productId: product.productId,
                quantity: product.returnQty,
            };
            });

        if (validReturns.length === 0) {
            Swal.fire({
            title: 'يجب تحديد منتجات صحيحة للإرجاع',
            icon: 'warning'
            });
            return;
        }

        const data = {
            orderId: this.selectedInvoice.id,
            returnAll: false,
            reason: '',
            products: validReturns
        };


        this._SalesreturnService.createSalesReturn(data).subscribe({
            next: (res) => {
            Swal.fire({
                title: 'تم تسجيل المرتجعات المحددة',
                icon: 'success'
            });
            this.getAllSalesReturn();
            this.onInvoiceChange();
            this.selectedInvoice.products.forEach((product: any) => {
                product.returnQty = 0;
                product.showReturnInput = false;
            });
            },
            error: (err) => {
            Swal.fire({
                title: 'حدث خطأ في الإرتجاع',
                text: err?.error?.message || '',
                icon: 'error'
            });
            }
        });
    }

    validateReturnQty(product: any): void {
        if (product.returnQty > product.quantity) {
            product.returnQty = product.quantity;
            Swal.fire({
                title: 'الكمية المرتجعة لا يمكن أن تكون أكبر من الكمية الأصلية',
                icon: 'error',
                timer: 2500,
            });
        } else if (product.returnQty < 1) {
            product.returnQty = 1;
        }
    }

    preventMinus(event: KeyboardEvent): void {
        if (event.key === '-' || event.key === '+') {
            event.preventDefault();
        }
    }

}
