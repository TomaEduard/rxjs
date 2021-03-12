import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

export const debug = (level: number, message: string) => 
  (source: Observable<any>) => source 
    .pipe(
      tap(val => {
        if (level === RxJsLoggingLevel.TRACE) {
          console.log(`%c${message}` + ': ' + val, 'background: lightblue; color: black');
        }
        if (level === RxJsLoggingLevel.INFO) {
          console.log(`%c${message}` + ': ' + val, 'background: orange; color: black');
        }
        if (level === RxJsLoggingLevel.INFO) {
          console.log(`%c${message}` + ': ' + val, 'background: yellow; color: black');
        }
        if (level === RxJsLoggingLevel.ERROR) {
          console.log(`%c${message}` + ': ' + val, 'background: red; color: black');
        }
      })
    );