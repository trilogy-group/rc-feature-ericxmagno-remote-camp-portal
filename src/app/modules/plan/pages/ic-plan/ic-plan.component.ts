import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DfToasterService } from '@devfactory/ngx-df/toaster';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PlanningService } from 'src/app/shared/services/planning.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { WeeklyPlanComponent } from 'src/app/modules/plan/components/weekly-plan/weekly-plan.component';
import { IcWeeklyPlan } from 'src/app/modules/plan/models/ic-weekly-plan.model';

@Component({
  selector: 'app-ic-plan',
  templateUrl: './ic-plan.component.html',
  styleUrls: ['./ic-plan.component.scss']
})
export class IcPlanComponent implements OnInit {
  public plan: IcWeeklyPlan[];
  public startDate: string;

  @ViewChildren(WeeklyPlanComponent)
  public weeklyPlans: QueryList<WeeklyPlanComponent>;

  constructor(
    private readonly planningService: PlanningService,
    private readonly toasterService: DfToasterService,
    private readonly route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  public ngOnInit(): void {
    forkJoin(
      this.planningService.getIcPlan(),
      this.profileService.getProfile()
    ).subscribe(([plan, profile]) => {
      this.plan = plan;
      this.startDate = profile.startDate;
    });
  }

  public savePlan(): void {
    this.planningService.savePlan(this.plan).subscribe(
      () => this.toasterService.popSuccess('Plan saved!'),
      error => {
        this.handleError(error);
      });
  }

  public closeOtherAccordions(week: number): void {
    this.weeklyPlans.forEach((weekPlan, index) => {
      if (index + 1 !== week) {
        weekPlan.closeAccordion();
      }
    });
  }

  private handleError(error): void {
    let errorMessage = 'Something went wrong';
    if (error && error.error) {
      errorMessage = error.error;
    } else if (error && error.message) {
      errorMessage = error.message;
    }

    this.toasterService.popError(errorMessage);
  }
}
