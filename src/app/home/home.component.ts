import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, filter } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


    beginnersCourses: Course[];
    advancedCourses: Course[];


    constructor() {

    }

    ngOnInit() {
        const http$ = createHttpObservable('/api/courses');
        const courses$ = http$
            // allow to chain operations
            .pipe(
                map(res => Object.values(res['payload'])), // transform into an object every res
            )

        courses$.subscribe((courses: Course[]) => {
                console.log(courses),
                this.beginnersCourses = courses.filter((course : Course) => course.category === "BEGINNER");
                this.advancedCourses = courses.filter((course : Course) => course.category === "ADVANCED");
            },
            // () => {}, // empty documentation or callback
            noop,
            () => console.log('completed')
        );

        console.log('1', this.beginnersCourses);
        console.log('2', this.advancedCourses);
    }

}
