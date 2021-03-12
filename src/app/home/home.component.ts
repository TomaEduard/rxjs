import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, filter, finalize } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnersCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor() {
    }
 
    ngOnInit() {
        const http$ = createHttpObservable('/api/courses');
        const courses$: Observable<Course[]> = http$
            .pipe(
                // catchError(err => {
                //     console.log('Error occurred', err); 
                //     console.log('Finalize executed..');
                // }),
                tap(() => console.log('HTTP request executed')), // allow to produce side effect
                map(res => Object.values(res['payload'])), // transform into an object every res
                shareReplay(),
                // each 2 sec try to fetch again
                retryWhen(errors => errors.pipe(
                    delayWhen(() => timer(2000))
                ))
            );

        this.beginnersCourses$ = courses$
            .pipe(
                map((courses: Course[]) => courses
                    .filter((course : Course) => course.category === "BEGINNER"))
            )

        this.advancedCourses$ = courses$
            .pipe(
                map((courses: Course[]) => courses
                    .filter((course : Course) => course.category === "ADVANCED"))
        )
    }

}
