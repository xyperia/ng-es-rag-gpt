import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementLayoutComponent } from './user-management-layout.component';
import { UserManagementComponent } from './user-management.component';
import { UserAddEditComponent } from './action/user-add-edit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserManagementRoutingModule,
        NgSelectModule,
        FormsModule,
        NgxPaginationModule,
        Ng2SearchPipeModule
    ],
    declarations: [
        UserManagementLayoutComponent,
        UserManagementComponent,
        UserAddEditComponent
    ]
})
export class UserManagementModule { }