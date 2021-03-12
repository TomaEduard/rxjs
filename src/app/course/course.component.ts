import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, throttle, throttleTime
} from 'rxjs/operators';
import { merge, Observable, concat, interval, fromEvent, forkJoin } from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
            .pipe(
                debug(RxJsLoggingLevel.INFO, 'course value'),
            )
        // this.course$ = course$;

        // setRxJsLoggingLevefel(RxJsLoggingLevel.DEBUG);
        const lesson$ = this.loadLessons();
              
        // emit objs when both obs is completed
        // forkJoin(course$, lesson$)
        //     .pipe(
        //         tap(([course, leasons]) => {
        //             console.log('course', course);
        //             console.log('leasons', leasons);
        //         })
        //     )
        //     .subscribe();

    }

    ngAfterViewInit() {
        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                // throttleTime((200)),
                startWith(''),
                debug(RxJsLoggingLevel.TRACE, "search"),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug(RxJsLoggingLevel.DEBUG, "lessons vealue"),
            )
    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
            map(res => res['payload']),
        )
    }

}
 