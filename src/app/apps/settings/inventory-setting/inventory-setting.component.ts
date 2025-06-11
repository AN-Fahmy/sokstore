import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Iinventory {
  id: number;
  name: string;
  employeeName: string;
  address: string;
  phone: number;
}


@Component({
  selector: 'app-inventory-setting',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './inventory-setting.component.html',
  styleUrl: './inventory-setting.component.css'
})
export class InventorySettingComponent {
    inventories: Iinventory[] = [
        { id: 1, name: 'عطر رجالي', address: 'شارع التحرير',employeeName:'إسلام', phone: 0o1247362751},
        { id: 2, name: 'إسوارة نسائية', address: 'شارع السلام الجديد',employeeName:'محمود', phone: 0o1247523416},
    ];

    filteredInventories: Iinventory[] = [...this.inventories];
    searchTerm: string = '';
    sortColumn: keyof Iinventory = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterInventories() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredInventories = this.inventories.filter(inventory => {
            return (
                inventory.name.toLowerCase().includes(term) ||
                inventory.address.toString().includes(term) ||
                inventory.employeeName.toString().includes(term) ||
                inventory.phone.toString().includes(term)
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
            this.inventories = this.inventories.filter(p => p.id !== id);
            this.filterInventories();
        }
    }
}
