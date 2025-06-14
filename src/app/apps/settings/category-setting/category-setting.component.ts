import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from 'src/app/service/category/category.service';
import Swal from 'sweetalert2';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-category-setting',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './category-setting.component.html',
  styleUrl: './category-setting.component.css'
})
export class CategorySettingComponent {
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _CategoryService = inject(CategoryService)

    allCategories:any[] = []
    categoryId:string = ''
    update:boolean = false
    ngOnInit(): void {
        this.getAllCategory()
    }

    getAllCategory():void{
        this._CategoryService.getAllCategory().subscribe({
            next:(res)=>{
                this.allCategories = res.data
                this.filteredCategories = [...this.allCategories]
            }
        })
    }

    categoryForm:FormGroup = this._FormBuilder.group({
        name:['']
    })

    submitCategoryForm():void{
        let data = this.categoryForm.value
        this._CategoryService.createCategory(data).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم إضافة فئة بنجاح",
                    icon: "success",
                })
                this.categoryForm.reset()
                this.getAllCategory()
            }
        })
    }

    deleteCategory(id:number):void{
        this._CategoryService.deleteCategory(id).subscribe({
            next:(res)=>{
                Swal.fire({
                    title: "تم حذف الفئة بنجاح",
                    icon: "success",
                })
                this.getAllCategory()
            }
        })
    }

    pathCategoryData(category:any):void{
        this.categoryId = category.id
        this.categoryForm.patchValue(category)
        this.update = true
    }

    updateCategory():void{
        let data = this.categoryForm.value
        data.id = this.categoryId

        this._CategoryService.updateCategory(this.categoryId, data).subscribe({
            next:(res)=>{
                this.update = false
                Swal.fire({
                    title: "تم تعديل الفئة بنجاح",
                    icon: "success",
                })
                this.categoryForm.reset()
                this.getAllCategory()
            }
        })
    }

    filteredCategories: Category[] = [...this.allCategories];
    searchTerm: string = '';
    sortColumn: keyof Category = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterCategories() {
        const term = this.searchTerm.trim().toLowerCase();

        this.filteredCategories = this.allCategories.filter(category =>
            category.name.toLowerCase().includes(term)
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
}
