import { noop, Observable } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { createHttpObservable } from '../common/util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    console.log('a', );

    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$
      // allow to chain operations
      .pipe(
        map(res => Object.values(res['payload'])), // transform into an object every res
        map(e => e['id'] = 333) // trnsform into an object every res
      )

      courses$.subscribe(
      courses => console.log(courses),
      // () => {}, // empty documentation or callback
      noop,
      () => console.log('completed')
    );

  }
}

