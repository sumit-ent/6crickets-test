import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DeadlineService } from './deadline.service';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-deadline-timer',
  template: `
    <div *ngIf="secondsLeft$ | async as secondsLeft">
      <h4>Seconds left to deadline: {{ secondsLeft }}</h4>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeadlineTimerComponent implements OnInit {
  secondsLeft$ = new BehaviorSubject<number>(0);

  constructor(private deadlineService: DeadlineService) {}

  ngOnInit(): void {
    this.deadlineService.getDeadline().pipe(
      switchMap((data) => {
        this.secondsLeft$.next(data.secondsLeft);
        return interval(1000).pipe(
          takeWhile(() => data.secondsLeft > 0),
          switchMap(() => {
            data.secondsLeft--;
            this.secondsLeft$.next(data.secondsLeft);
            return this.secondsLeft$;
          })
        );
      })
    ).subscribe();
  }
}