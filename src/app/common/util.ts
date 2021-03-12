import { Observable } from "rxjs";


export function createHttpObservable(url: string): Observable<any> {
  return Observable.create(observer => {

    const controller = new AbortController();
    // if emit true value, the fetch request will be canceled by the browser
    const signal = controller.signal; 

    fetch(url, {signal})
      .then(response => {

        if (response.ok) {
          return response.json();
        } else {
          observer.error('Request failed with status code: ' + response.status)
        }

        return response.json();
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      })

    return () => {
      controller.abort();
    }

  });

}