import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RuleManagementService } from '../rule-management.service';
import { AlertService } from 'src/app/auth/helpers/alert.service';
import { first } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({ templateUrl: 'rule-add-edit.component.html' })
export class RuleAddEditComponent implements OnInit, OnDestroy {
    private subs = new SubSink();
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ruleService: RuleManagementService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            RULE_NAME: ['', Validators.required],
            USER_MGMT: [''],
            ACTIVITY_MGMT: [''],
            LEADERBOARDS_PAGE: [''],
            CONTENT_MGMT: [''],
            PIPELINES_PAGE: [''],
            REVENUE_LEADERBOARD: ['']
        });

        if (!this.isAddMode) {
            this.subs.add(this.ruleService.getByID(this.id).subscribe(x => this.form.patchValue(x)));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            // this.form.value.RULE_ID = this.form.value.RULE_NAME.replace(/ .*/,'').replace( /[aeiou]/ig, '' ).toUpperCase()+'00'+this.getRandomInt(10)
            this.createRole();
        } else {
            this.updateRule();
        }
    }

    private createRole() {
        this.alertService.loading();
        this.subs.add(this.ruleService.register(this.form.value).pipe(first()).subscribe({
            next: () => {
                this.alertService.success();
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        }));
    }

    private updateRule() {
        this.alertService.loading();
        this.subs.add(this.ruleService.update(this.id, this.form.value).pipe(first()).subscribe({
            next: () => {
                this.alertService.success();
                this.router.navigate(['../../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        }));
    }

     getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

    ngOnDestroy(): void{
        this.subs.unsubscribe();
    }
}