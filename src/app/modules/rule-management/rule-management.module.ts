import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleManagementComponent } from './rule-management.component';
import { RuleManagementRoutingModule } from './rule-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleManagementLayoutComponent } from './rule-management-layout.component';
import { RuleAddEditComponent } from './action/rule-add-edit.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    RuleManagementComponent,
    RuleManagementLayoutComponent,
    RuleAddEditComponent
  ],
  imports: [
    CommonModule,
    RuleManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ]
})
export class RuleManagementModule { }
