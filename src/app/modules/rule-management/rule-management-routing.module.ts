import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleAddEditComponent } from './action/rule-add-edit.component';
import { RuleManagementLayoutComponent } from './rule-management-layout.component';
import { RuleManagementComponent } from './rule-management.component';

const routes: Routes = [
    {
        path: 'rule-management', component: RuleManagementLayoutComponent,
        children: [
            { path: '', component: RuleManagementComponent },
            { path: 'add', component: RuleAddEditComponent },
            { path: 'edit/:id', component: RuleAddEditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RuleManagementRoutingModule { }