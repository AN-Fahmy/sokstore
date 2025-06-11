import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// shared module
import { SharedModule } from 'src/shared.module';

import { ScrumboardComponent } from './scrumboard';
import { ContactsComponent } from './contacts';
import { NotesComponent } from './notes';
import { TodolistComponent } from './todolist';
import { InvoicePreviewComponent } from './invoice/preview';
import { InvoiceAddComponent } from './invoice/add';
import { InvoiceEditComponent } from './invoice/edit';
import { CalendarComponent } from './calendar';
import { ChatComponent } from './chat';
import { MailboxComponent } from './mailbox';
import { InvoiceListComponent } from './invoice/list';
import { SettingsComponent } from './settings/settings.component';
import { CategorySettingComponent } from './settings/category-setting/category-setting.component';
import { IconModule } from '../shared/icon/icon.module';
import { ProductSettingComponent } from './settings/product-setting/product-setting.component';
import { SupplierSettingComponent } from './settings/supplier-setting/supplier-setting.component';
import { ClientSettingComponent } from './settings/client-setting/client-setting.component';
import { InventorySettingComponent } from './settings/inventory-setting/inventory-setting.component';
import { EmployeeSettingComponent } from './settings/employee-setting/employee-setting.component';
import { SalesOperationsComponent } from './sales-operations/sales-operations.component';
import { SalesReturnComponent } from './sales-return/sales-return.component';
import { PurchasesOperationsComponent } from './purchases-operations/purchases-operations.component';

const routes: Routes = [
    { path: 'apps/chat', component: ChatComponent, data: { title: 'Chat' } },
    { path: 'apps/mailbox', component: MailboxComponent, data: { title: 'Mailbox' } },
    { path: 'apps/scrumboard', component: ScrumboardComponent, data: { title: 'Scrumboard' } },
    { path: 'apps/contacts', component: ContactsComponent, data: { title: 'Contacts' } },
    { path: 'apps/notes', component: NotesComponent, data: { title: 'Notes' } },
    { path: 'apps/todolist', component: TodolistComponent, data: { title: 'Todolist' } },
    { path: 'apps/invoice/list', component: InvoiceListComponent, data: { title: 'Invoice List' } },
    { path: 'apps/invoice/preview', component: InvoicePreviewComponent, data: { title: 'Invoice Preview' } },
    { path: 'apps/invoice/add', component: InvoiceAddComponent, data: { title: 'Invoice Add' } },
    { path: 'apps/invoice/edit', component: InvoiceEditComponent, data: { title: 'Invoice Edit' } },
    { path: 'apps/calendar', component: CalendarComponent, data: { title: 'Calendar' } },
    { path: 'apps/settings', component: SettingsComponent, data: { title: 'Settings' } },
    { path: 'apps/settings/category-setting', component: CategorySettingComponent, data: { title: 'Category-Settings' } },
    { path: 'apps/settings/product-setting', component: ProductSettingComponent, data: { title: 'Product-Settings' } },
    { path: 'apps/settings/supplier-setting', component: SupplierSettingComponent, data: { title: 'Supplier-Settings' } },
    { path: 'apps/settings/client-setting', component: ClientSettingComponent, data: { title: 'Client-Settings' } },
    { path: 'apps/settings/inventory-setting', component: InventorySettingComponent, data: { title: 'Inventory-Settings' } },
    { path: 'apps/settings/employee-setting', component: EmployeeSettingComponent, data: { title: 'Employee-Settings' } },
    { path: 'apps/sales-operation', component: SalesOperationsComponent, data: { title: 'Sales-Operation' } },
    { path: 'apps/sales-return', component: SalesReturnComponent, data: { title: 'Sales-Return' } },
    { path: 'apps/purchases-operation', component: PurchasesOperationsComponent, data: { title: 'Purchases-Operation' } },
    { path: 'apps/purchases-return', component: SalesReturnComponent, data: { title: 'Purchases-Return' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot(), IconModule],
    declarations: [
        ChatComponent,
        ScrumboardComponent,
        ContactsComponent,
        NotesComponent,
        TodolistComponent,
        InvoiceListComponent,
        InvoicePreviewComponent,
        InvoiceAddComponent,
        InvoiceEditComponent,
        CalendarComponent,
        MailboxComponent,
    ],

})
export class AppsModule {}
