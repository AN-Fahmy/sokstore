import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

interface ISaleProduct {
  productId: number;
  porductName: string;
  quantity: number;
  totalAmount: number; // سعر الكمية كلها للمنتج هذا
}

interface ISalesOperation {
  id: number;
  clientName: string;
  products: ISaleProduct[];
  details: string;
}

@Component({
  selector: 'app-sales-return',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './sales-return.component.html',
  styleUrl: './sales-return.component.css'
})
export class SalesReturnComponent {
    selectedInvoiceId!: number;
    selectedInvoice?: ISalesOperation;

    selectedProductId!: number;
    selectedProduct?: ISaleProduct;

    returnQuantity: number = 0;

    returnsHistory: any[] = []; // لتخزين المرتجعات

    salesOperation: ISalesOperation[] = [
        {
            id: 1,
            clientName: 'محمد',
            products: [
                { productId: 101, porductName: 'عطر رجالي', quantity: 12, totalAmount: 1249 },
                { productId: 102, porductName: 'عطر نسائي', quantity: 5, totalAmount: 500 }
            ],
            details: 'اول عملية بيع'
        },
        {
            id: 2,
            clientName: 'أحمد',
            products: [
            { productId: 201, porductName: 'اسوارة حريمي', quantity: 52, totalAmount: 320 }
            ],
            details: 'تاني عملية بيع'
        },
    ];

    onInvoiceChange() {
        this.selectedInvoice = this.salesOperation.find(inv => inv.id === this.selectedInvoiceId);
        this.selectedProduct = undefined;
        this.selectedProductId = 0;
        this.returnQuantity = 0;
    }

    onProductChange() {
        if (this.selectedInvoice) {
            this.selectedProduct = this.selectedInvoice.products.find(p => p.productId === this.selectedProductId);
            this.returnQuantity = 0;
        }
    }

    calculateRefundAmount(): number {
        if (!this.selectedProduct || this.returnQuantity <= 0) return 0;
        const pricePerUnit = this.selectedProduct.totalAmount / this.selectedProduct.quantity;
        return +(pricePerUnit * this.returnQuantity).toFixed(2);
    }

    addReturn() {
        if (!this.selectedInvoice || !this.selectedProduct) {
            alert('اختر الفاتورة والمنتج أولاً');
            return;
        }
        if (this.returnQuantity <= 0 || this.returnQuantity > this.selectedProduct.quantity) {
            alert('الكمية المرتجعة غير صحيحة');
            return;
        }

        const refundAmount = this.calculateRefundAmount();

        this.returnsHistory.push({
            invoiceId: this.selectedInvoice.id,
            productId: this.selectedProduct.productId,
            productName: this.selectedProduct.porductName,
            returnQuantity: this.returnQuantity,
            refundAmount: refundAmount,
        });

        alert('تم إضافة المرتجع بنجاح');

        // إعادة تعيين الحقول
        this.selectedProduct = undefined;
        this.selectedProductId = 0;
        this.returnQuantity = 0;
    }


}
