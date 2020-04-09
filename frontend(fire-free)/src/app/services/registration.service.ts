import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Registration } from 'src/app/shared/registration';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private subject = new Subject<string>();

  constructor(private httpClient: HttpClient) { }

  doRegistration(sendToServerData: Registration) {
    // tslint:disable-next-line: max-line-length
    this.httpClient.post<{status: string}>(environment.custom.REGISTRATION_URL, sendToServerData, { observe: 'response' }).subscribe(response => {
      if (response.body.status === 'success') {
        this.subject.next(response.body.status);
      }
    });
  }

  get getStatus(): Observable<string> {
    return this.subject.asObservable();
  }

  validation(sendToServerData: Registration) {
    const nameCondition = new RegExp('^([A-Za-z ]){4,20}$');
    const contactCondition = new RegExp('^([+])(8801)(3|4|5|6|7|8|9)([1-9]){8}$');
    const conditionArea = new RegExp('^([0-9]){4}$');
    const conditionAmount = new RegExp('^([1-9]){3,4}$');
    const conditionCode = new RegExp('^(#)([0-9]){6}$');

    if (nameCondition.test(sendToServerData.consumerName) &&
      contactCondition.test(sendToServerData.contactNumber) &&
      conditionArea.test(String(sendToServerData.areaCode)) &&
      conditionAmount.test(String(sendToServerData.amountOfRobot)) &&
      conditionCode.test(sendToServerData.codeOfRobot)
    ) {
      return 'ok';
    } else {
      return 'error';
    }
  }
}
