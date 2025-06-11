import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface IClient {
  id: number;
  name: string;
  address: string;
  phone: number;
}

@Component({
  selector: 'app-client-setting',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './client-setting.component.html',
  styleUrl: './client-setting.component.css'
})
export class ClientSettingComponent {
    clients: IClient[] = [
        { id: 1, name: 'إسلام', address: 'شارع التحرير', phone: 0o1247362751},
        { id: 2, name: 'محمود', address: 'شارع السلام الجديد', phone: 0o1247523416},
    ];

    filteredClients: IClient[] = [...this.clients];
    searchTerm: string = '';
    sortColumn: keyof IClient = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterClients() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredClients = this.clients.filter(supplier => {
            return (
                supplier.name.toLowerCase().includes(term) ||
                supplier.address.toString().includes(term) ||
                supplier.phone.toString().includes(term)
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

    onEdit(product: IClient) {
        console.log('تعديل العميل:', product);
    }

    onDelete(id: number) {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            this.clients = this.clients.filter(p => p.id !== id);
            this.filterClients();
        }
    }
}
