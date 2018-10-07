import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

    private subject = new Subject<any>();

    constructor() {
    }

    success(message: string) {
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string) {
        this.subject.next({ type: 'error', text: message });
    }

    info(message: string) {
        this.subject.next({ type: 'info', text: message });
    }
 
    warn(message: string) {
        this.subject.next({ type: 'warning', text: message });
    }

    clear() {
        // clear alerts
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
