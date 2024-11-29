import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAddEditComponent } from './action/user-add-edit.component';

import { UserManagementLayoutComponent } from './user-management-layout.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
    {
        path: 'user-management', component: UserManagementLayoutComponent,
        children: [
            { path: '', component: UserManagementComponent },
            { path: 'add', component: UserAddEditComponent },
            { path: 'edit/:id', component: UserAddEditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRoutingModule { }