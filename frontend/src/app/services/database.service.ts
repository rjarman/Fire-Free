import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  AdminDatum,
  ConsumerDatum,
  ViewerDataFormatter,
  NotificationDatum,
} from '../shared/viewerDataFormatter';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _adminData = new Subject<ViewerDataFormatter<AdminDatum>>();
  private _consumerData = new Subject<ViewerDataFormatter<ConsumerDatum[]>>();
  private _notificationData = new Subject<
    ViewerDataFormatter<NotificationDatum[]>
  >();
  private _notificationNumber = new Subject<number>();

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private toastController: ToastController
  ) {}

  fetchData() {
    this.httpClient
      .post<{ adminData: AdminDatum; consumerData: ConsumerDatum[] }>(
        environment.custom.VIEW_URL,
        { email: this.cookieService.get('email') },
        { observe: 'response' }
      )
      .subscribe((response) => {
        this._adminData.next(
          new ViewerDataFormatter<AdminDatum>(response.body.adminData)
        );
        this._consumerData.next(
          new ViewerDataFormatter<ConsumerDatum[]>(response.body.consumerData)
        );
      });
  }

  get adminData(): Observable<ViewerDataFormatter<AdminDatum>> {
    return this._adminData.asObservable();
  }

  get consumerData(): Observable<ViewerDataFormatter<ConsumerDatum[]>> {
    return this._consumerData.asObservable();
  }

  fetchNotification(isMenu = false) {
    if (isMenu) {
      this.httpClient
        .post<{ data: NotificationDatum[]; status: string }>(
          environment.custom.NOTIFICATION_URL,
          { email: this.cookieService.get('email') },
          { observe: 'response' }
        )
        .subscribe((response) => {
          if (response.body.status === 'noData') {
            this.showToast('No Notifications!');
            this._notificationNumber.next(0);
          } else {
            let count = 0;
            response.body.data.forEach((state) => {
              if (state.hardwareState === 'warning') {
                count++;
              }
            });
            this._notificationNumber.next(count);
          }
        });
    } else {
      this.httpClient
        .post<{ data: NotificationDatum[]; status: string }>(
          environment.custom.NOTIFICATION_URL,
          { email: this.cookieService.get('email') },
          { observe: 'response' }
        )
        .subscribe((response) => {
          if (response.body.status === 'noData') {
            this.showToast('No Notifications!');
            this._notificationNumber.next(0);
          } else {
            this._notificationData.next(
              new ViewerDataFormatter<NotificationDatum[]>(response.body.data)
            );
          }
        });
    }
  }

  get notificationData(): Observable<ViewerDataFormatter<NotificationDatum[]>> {
    return this._notificationData.asObservable();
  }

  get notificationNumber(): Observable<number> {
    return this._notificationNumber.asObservable();
  }

  setAsSolved(mAddress) {
    this.httpClient
      .post<{ data: string; status: string }>(
        environment.custom.SET_SOLVED_NOTIFICATION_URL,
        { macAddress: mAddress, email: this.cookieService.get('email') },
        { observe: 'response' }
      )
      .subscribe((response) => {
        if (response.body.status === 'ok') {
          this.showToast(`${response.body.data} is marked as solved!`);
        } else {
          this.showToast(`${response.body.data} can't be modified!`);
        }
      });
  }

  private async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
    });
    toast.present();
  }
}
