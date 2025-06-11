import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-category-setting',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule],
  templateUrl: './category-setting.component.html',
  styleUrl: './category-setting.component.css'
})
export class CategorySettingComponent {
    categories: Category[] = [
        { id: 1, name: 'عطور' },
        { id: 2, name: 'إكسسوارات' },
    ];
    filteredCategories: Category[] = [...this.categories];
    searchTerm: string = '';
    sortColumn: keyof Category = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterCategories() {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(term) ||
        category.id.toString().includes(term)
    );

    this.sortCategories();
    }

    sortBy(column: keyof Category) {
    if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
    }
    this.sortCategories();
    }

    sortCategories() {
    this.filteredCategories.sort((a, b) => {
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

    onEdit(category: Category) {
    console.log('تعديل الفئة:', category);
    }

    onDelete(id: number) {
    if (confirm('هل أنت متأكد من الحذف؟')) {
        this.categories = this.categories.filter(c => c.id !== id);
        this.filterCategories();
    }
    }

}
