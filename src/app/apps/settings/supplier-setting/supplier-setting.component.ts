import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ISupplier {
  id: number;
  name: string;
  address: string;
  phone: number;
}

@Component({
  selector: 'app-supplier-setting',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './supplier-setting.component.html',
  styleUrl: './supplier-setting.component.css'
})
export class SupplierSettingComponent {
    suppliers: ISupplier[] = [
        { id: 1, name: 'عطر رجالي', address: 'شارع التحرير', phone: 0o1247362751},
        { id: 2, name: 'إسوارة نسائية', address: 'شارع السلام الجديد', phone: 0o1247523416},
    ];

    filteredSuppliers: ISupplier[] = [...this.suppliers];
    searchTerm: string = '';
    sortColumn: keyof ISupplier = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterSuppliers() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredSuppliers = this.suppliers.filter(supplier => {
            return (
                supplier.name.toLowerCase().includes(term) ||
                supplier.address.toString().includes(term) ||
                supplier.phone.toString().includes(term)
            );
        });

        this.sort();
    }
    sortBy(column: keyof ISupplier) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }

    sort() {
        this.filteredSuppliers.sort((a, b) => {
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

    onEdit(product: ISupplier) {
        console.log('تعديل المورد:', product);
    }

    onDelete(id: number) {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            this.suppliers = this.suppliers.filter(p => p.id !== id);
            this.filterSuppliers();
        }
    }
}
