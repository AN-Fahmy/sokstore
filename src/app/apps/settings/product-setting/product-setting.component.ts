import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  supplierName: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
}

@Component({
  selector: 'app-product-setting',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './product-setting.component.html',
  styleUrl: './product-setting.component.css'
})
export class ProductSettingComponent {
    products: Product[] = [
        { id: 1, name: 'عطر رجالي',supplierName:'إسلام', purchasePrice: 50, salePrice: 75, quantity: 10 },
        { id: 2, name: 'إسوارة نسائية',supplierName:'محمود', purchasePrice: 20, salePrice: 45, quantity: 25 },
    ];

    filteredProducts: Product[] = [...this.products];
    searchTerm: string = '';
    sortColumn: keyof Product = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterProducts() {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredProducts = this.products.filter(product => {
        return (
        product.name.toLowerCase().includes(term) ||
        product.purchasePrice.toString().includes(term) ||
        product.salePrice.toString().includes(term) ||
        product.quantity.toString().includes(term)
        );
    });

    this.sort();
    }
    sortBy(column: keyof Product) {
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

    onEdit(product: Product) {
        console.log('تعديل المنتج:', product);
    }

    onDelete(id: number) {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            this.products = this.products.filter(p => p.id !== id);
            this.filterProducts();
        }
    }
}
