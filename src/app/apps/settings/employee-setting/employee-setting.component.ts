import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface IEmployee {
  id: number;
  name: string;
  address: string;
  phone: number;
  userName: string;
  password: string;
}

@Component({
  selector: 'app-employee-setting',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './employee-setting.component.html',
  styleUrl: './employee-setting.component.css'
})
export class EmployeeSettingComponent {
    employees: IEmployee[] = [
        { id: 1, name: 'محمد', address: 'شارع التحرير', phone: 0o1247362751, userName:'user1', password:'123123123'},
        { id: 2, name: 'أحمد', address: 'شارع السلام الجديد', phone: 0o1247523416, userName:'user2', password:'123123123'},
    ];

    filteredEmployees: IEmployee[] = [...this.employees];
    searchTerm: string = '';
    sortColumn: keyof IEmployee = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterEmployees() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredEmployees = this.employees.filter(supplier => {
            return (
                supplier.name.toLowerCase().includes(term) ||
                supplier.address.toString().includes(term) ||
                supplier.phone.toString().includes(term)
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

    onEdit(product: IEmployee) {
        console.log('تعديل الموظف:', product);
    }

    onDelete(id: number) {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            this.employees = this.employees.filter(p => p.id !== id);
            this.filterEmployees();
        }
    }
}
