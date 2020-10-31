import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationDatum } from 'src/app/shared/viewerDataFormatter';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  private _isClicked = new Subject<number>();
  private clickCounter: any;
  private clickedCard: string;

  consumerImagePath: string;
  notificationData: NotificationDatum[];
  isLoaded: boolean;
  constructor(
    private alertController: AlertController,
    private databaseService: DatabaseService,
    private router: Router
  ) {
    this.isLoaded = false;
    this.consumerImagePath = environment.custom.PATH.CONSUMER_PATH;
    this.clickCounter = {};
    this.databaseService.fetchNotification();

    this.isClicked.subscribe((clickedData) => {
      if (clickedData[this.clickedCard] % 2 === 0) {
        document.getElementById(this.clickedCard).style.animationName =
          'warningBackward';
        document.getElementById(this.clickedCard).style.animationDuration =
          '1s';
        document.getElementById(this.clickedCard).style.width = '0px';
      } else {
        document.getElementById(this.clickedCard).style.animationName =
          'warningForward';
        document.getElementById(this.clickedCard).style.animationDuration =
          '.5s';
        document.getElementById(this.clickedCard).style.width = '80px';
      }
    });
  }

  ngOnInit() {
    document.getElementById('notificationHeader').style.display = 'none';
    this.databaseService.notificationData.subscribe((notificationData) => {
      this.notificationData = notificationData.viewerData;
      if (this.notificationData.length > 0) {
        document.getElementById('notificationHeader').style.display = '';
        this.isLoaded = true;
      }
    });
  }

  isSolved(state) {
    if (state === 'warning') {
      return true;
    }
    return false;
  }

  setAsSolved(macAddress) {
    this.warning(macAddress);
    this.databaseService.setAsSolved(macAddress);
    this.databaseService.fetchNotification();
    this.databaseService.fetchNotification(true);
  }

  warning(macAddress) {
    this.clickedCard = macAddress;
    if (this.clickCounter[macAddress]) {
      this.clickCounter[macAddress] = this.clickCounter[macAddress] + 1;
    } else {
      Object.defineProperty(this.clickCounter, macAddress, {
        value: 1,
        writable: true,
      });
    }
    this._isClicked.next(this.clickCounter);
  }

  get isClicked(): Observable<number> {
    return this._isClicked.asObservable();
  }

  refresh(event) {
    this.databaseService.fetchNotification();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async showAbout(notificationDatum) {
    if (
      this.clickCounter[notificationDatum.consumerData.macAddress] &&
      this.clickCounter[notificationDatum.consumerData.macAddress] % 2 !== 0
    ) {
      this.clickCounter[notificationDatum.consumerData.macAddress] =
        this.clickCounter[notificationDatum.consumerData.macAddress] + 1;
      this.clickedCard = notificationDatum.consumerData.macAddress;
      this._isClicked.next(this.clickCounter);
    }
    const about = await this.alertController.create({
      header: 'Fire-Free',
    });
    const headerID = document
      .getElementsByClassName('alert-head')[0]
      .getElementsByTagName('h2')[0].id;
    document.getElementById(headerID).style.textAlign = 'center';
    document.getElementsByClassName('alert-wrapper')[0][
      'style'
    ].backgroundColor = '#D7DEDC';
    document.getElementById(headerID).innerHTML = `
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <ion-avatar style="position: absolute;left: 50%;right: 50%;transform: translate(-50%, -50%);margin-top: 25px;">
            <img src="${
              this.consumerImagePath + notificationDatum.consumerData.imagePath
            }" alt="logo" width="50px" height="50px">
          </ion-avatar>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" id="${notificationDatum.consumerData.macAddress}">
        <p style="font-family: 'Courier New', Courier, monospace;margin-top: 60px;">
          <strong><em>${
            notificationDatum.consumerData.consumerName
          }</em></strong>
        </p>
        <p style="font-size: 12px;font-family: 'Courier New', Courier, monospace;margin-top: -20px;">
          <a href="mailto:${
            notificationDatum.consumerData.email
          }" style="color: #94BF69">${notificationDatum.consumerData.email}</a>
        </p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="3" offset="3">
          <a id="${notificationDatum.consumerData.macAddress + 1}">
            <img id="blog" src="../../../assets/icon/Google_Maps_icon.svg" alt="blog" width="25px" height="25px" style="margin-right: 5px;">
          </a>
        </ion-col>
        <ion-col size="3">
          <a href="tel:${notificationDatum.consumerData.contactNumber}">
            <img id="blog" src="../../../assets/icon/phone-solid.svg" alt="blog" width="25px" height="25px" style="margin-right: 5px;">
          </a>
        </ion-col>
      </ion-row>
    </ion-grid>
    <hr style="border-top: 1px solid #B0B3B5;">
    <div style="text-align: center;margin-bottom: -35px;">
        <p style="font-size: 12px; color: #B0B3B5;">MAC Address: ${
          notificationDatum.consumerData.macAddress
        }</p>
    </div>`;
    if (notificationDatum.solvedBy) {
      document.getElementById(
        notificationDatum.consumerData.macAddress
      ).innerHTML += `
      <p style="font-size: 12px;font-family: 'Courier New', Courier, monospace;margin-top: -5px;">
        Solved By:<br><a href="mailto:${notificationDatum.solvedBy}" style="color: #94BF69">${notificationDatum.solvedBy}</a>
      </p>`;
    }
    document
      .getElementById(notificationDatum.consumerData.macAddress + 1)
      .addEventListener('click', (e: Event) => {
        this.alertController.dismiss();
        this.router.navigate([
          '/menus/notification/map',
          JSON.stringify(notificationDatum),
        ]);
      });
    await about.present();
  }
}
