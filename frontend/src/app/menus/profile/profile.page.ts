import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { environment } from 'src/environments/environment';
import { OpacityStyle, TopStyle } from 'src/app/styles';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private count: number;

  adminData: any;
  consumerData: any[];
  isDefaultProfile: boolean;
  defaultImagePath: string;
  consumerImagePath: string;
  isDesignationSet: boolean;
  isLoaded: boolean;
  isHR: any[];

  constructor(
    private alertController: AlertController,
    private router: Router,
    private databaseService: DatabaseService
  ) {
    this.adminData = {};
    this.consumerData = [];
    this.isHR = [];
    this.isDesignationSet = false;
    this.isLoaded = false;
    this.count = 0;
    this.databaseService.fetchData();
  }

  ngOnInit() {
    this.defaultImagePath = environment.custom.PATH.ADMIN_PATH;
    this.consumerImagePath = environment.custom.PATH.CONSUMER_PATH;
    this.databaseService.adminData.subscribe((adminData) => {
      if (adminData.viewerData.designation !== '') {
        this.isDesignationSet = true;
      }
      if (Object.keys(adminData.viewerData).length > 0) {
        this.isLoaded = true;
      }
      Object.assign(this.adminData, adminData.viewerData);
      if (adminData.viewerData.imagePath === 'default') {
        this.isDefaultProfile = true;
      } else {
        this.isDefaultProfile = false;
      }
    });
    this.databaseService.consumerData.subscribe((consumerData) => {
      this.defineRow(consumerData.viewerData, this.count);
      this.count++;
    });
  }

  defineRow(element, count) {
    if (count === 0) {
      const tempArray = [];
      if (element.length < 4) {
        tempArray.push(element);
      } else {
        let temp = 0;
        for (let i = 0; i <= element.length - 4; i++) {
          tempArray.push(element.slice(temp, (temp += 4)));
        }
      }
      tempArray.forEach((tempData) => {
        if (tempData.length) {
          this.consumerData.push(tempData);
          tempData.forEach((data) => {
            Object.defineProperty(data, 'frontendStructure', {
              value: {
                shortConsumerName: data.consumerName.slice(0, 5) + '....',
                shortMACAddress:
                  data.macAddress.split('-')[0] +
                  '-' +
                  data.macAddress.split('-')[1] +
                  '....',
              },
            });
          });
        }
      });
      const a = Array.from({ length: this.consumerData.length });
      a[a.length - 1] = true;
      this.isHR = a;
    }
  }

  reset() {
    if (this.consumerData.length > 0) {
      this.consumerData = [];
    }
  }

  edit() {
    this.router.navigate([
      '/menus/profile/edit',
      JSON.stringify(this.adminData),
    ]);
  }

  async showAbout(consumerData) {
    const about = await this.alertController.create({
      header: 'Fire-Free',
    });
    const headerID = document
      .getElementsByClassName('alert-head')[0]
      .getElementsByTagName('h2')[0].id;
    document.getElementById(headerID).style.textAlign = 'center';
    document.getElementsByClassName('alert-wrapper')[0][
      'style'
    ].backgroundColor = '#1B5259';
    document.getElementById(headerID).innerHTML = `
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <ion-avatar style="position: absolute;left: 50%;right: 50%;transform: translate(-50%, -50%);margin-top: 25px;">
            <img src="${
              this.consumerImagePath + consumerData.imagePath
            }" alt="logo" width="50px" height="50px">
          </ion-avatar>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
        <p style="font-family: 'Courier New', Courier, monospace;margin-top: 60px;color: #6FEBE1;">
          <strong><em>${consumerData.consumerName}</em></strong>
        </p>
        <p style="font-size: 12px;font-family: 'Courier New', Courier, monospace;margin-top: -20px;">
          <a href="mailto:${consumerData.email}" style="color: #94BF69">${
      consumerData.email
    }</a>
        </p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <a href="tel:${consumerData.contactNumber}">
            <img id="blog" src="../../../assets/icon/phone-solid.svg" alt="blog" width="25px" height="25px" style="margin-right: 5px;">
          </a>
        </ion-col>
      </ion-row>
    </ion-grid>
    <hr style="border-top: 1px solid #B0B3B5;">
    <div style="text-align: center;margin-bottom: -35px;">
        <p style="font-size: 12px; color: #B0B3B5;">MAC Address: ${
          consumerData.macAddress
        }</p>
    </div>`;
    await about.present();
  }

  onScroll(event) {
    document.getElementById('profile').style.filter = `opacity(${
      OpacityStyle[event.detail.scrollTop].opacityValue
    })`;
    document.getElementById('stickyProfile').style.position = '-webkit-sticky';
    document.getElementById('stickyProfile').style.position = 'sticky';
    const offsetHeight = document.images['profile'].offsetHeight;
    document.getElementById(
      'stickyProfile'
    ).style.top = `${TopStyle[offsetHeight].topValue}`;
    document.getElementById('stickyProfile').style.zIndex = '1';
  }
}
