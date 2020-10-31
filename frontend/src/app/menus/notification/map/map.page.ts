import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationDatum } from 'src/app/types';
import { Subject, Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit, OnDestroy {
  @ViewChild('googleMapContainer', { static: false })
  googleMapContainer: ElementRef;

  consumerImagePath: string;
  notificationDatum: NotificationDatum;
  shortDestination: string;
  shortOrigin: string;
  isMatrixAvailable: boolean;
  trafficStyle: string;
  private isNavigate: boolean;

  // map
  private googleMap: google.maps.Map;

  private consumerCoordinates: google.maps.LatLng;
  private fireServiceCoordinates: google.maps.LatLng;
  private _getFireServiceCoordinates = new Subject<google.maps.LatLng>();

  private mapOptions: google.maps.MapOptions;

  private consumerMarker: google.maps.Marker;
  private fireServiceMarker = new google.maps.Marker();
  private fireServiceOfficeMarker = new google.maps.Marker();

  private infoWindow: google.maps.InfoWindow;
  private infoWindowInnerHTML: string;

  private directionsService = new google.maps.DirectionsService();
  private directionRenderer = new google.maps.DirectionsRenderer();
  private distanceMatrix = new google.maps.DistanceMatrixService();
  private _distanceMatrixObserver = new Subject<
    google.maps.DistanceMatrixResponse
  >();
  private get distanceMatrixObserver(): Observable<
    google.maps.DistanceMatrixResponse
  > {
    return this._distanceMatrixObserver.asObservable();
  }
  distanceMatrixData: google.maps.DistanceMatrixResponse;

  private geolocationUnsubscribed: any;

  constructor(
    private activatedRouter: ActivatedRoute,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private pdfService: PdfService
  ) {
    this.isNavigate = false;
    this.consumerImagePath = environment.custom.PATH.CONSUMER_PATH;

    this.activatedRouter.params.subscribe((notificationDatum) => {
      this.notificationDatum = JSON.parse(notificationDatum.notificationData);
    });

    this.getFireServiceCoordinates.subscribe((coordinates) => {
      this.fireServiceCoordinates = coordinates;
    });

    this.distanceMatrixObserver.subscribe((distanceMatrixData) => {
      this.distanceMatrixData = distanceMatrixData;
    });

    this.geolocationUnsubscribed = this.geolocation
      .watchPosition({ enableHighAccuracy: true })
      .subscribe((data) => {
        this._getFireServiceCoordinates.next(
          new google.maps.LatLng(data.coords.latitude, data.coords.longitude)
        );
        if (this.isNavigate) {
          this._getFireServiceCoordinates.next(
            new google.maps.LatLng(
              data.coords.latitude + 0.01,
              data.coords.longitude
            )
          );
          this.navigate();
        }
      });
  }

  async ngAfterViewInit() {
    this.toggleLoading(true);
    if (await this.setNotificationDatum) {
      if (await this.setGoogleMap) {
        this.consumerMarker.setMap(this.googleMap);
        this.generateInfoWindow(0, true, Infinity);
        google.maps.event.addListener(this.consumerMarker, 'click', () => {
          this.consumerMarkerButton();
        });
      }
    }
  }

  ngOnDestroy() {
    this.geolocationUnsubscribed.unsubscribe();
  }

  private get setGoogleMap() {
    return new Promise((resolve, reject) => {
      this.googleMap = new google.maps.Map(
        this.googleMapContainer.nativeElement,
        this.mapOptions
      );
      if (this.googleMap) {
        resolve(true);
      }
    });
  }

  private get setNotificationDatum() {
    return new Promise((resolve, reject) => {
      this.activatedRouter.params.subscribe((notificationDatum) => {
        this.notificationDatum = JSON.parse(notificationDatum.notificationData);
        this.consumerCoordinates = new google.maps.LatLng(
          Number(this.notificationDatum.hardwareData.gps.latitude),
          Number(this.notificationDatum.hardwareData.gps.longitude)
        );
        this.setMapOptions();
        if (this.consumerCoordinates) {
          resolve(true);
        }
      });
    });
  }

  private setMapOptions() {
    this.mapOptions = {
      center: this.consumerCoordinates,
      zoom: 18,
      fullscreenControl: false,
      clickableIcons: true,
      disableDefaultUI: true,
    };
    this.consumerMarker = new google.maps.Marker({
      position: this.consumerCoordinates,
      map: this.googleMap,
      icon: {
        url: '../../../../assets/icon/fire.png',
      },
      animation: google.maps.Animation.BOUNCE,
    });
  }

  private getUserPosition(positionType, tOut = Infinity) {
    return new Promise((resolve, reject) => {
      this.geolocation
        .getCurrentPosition({
          enableHighAccuracy: true,
          timeout: tOut,
          maximumAge: positionType,
        })
        .then((data) => {
          // this.fireServiceLAT = data.coords.latitude;
          // this.fireServiceLNG = data.coords.longitude;
          this._getFireServiceCoordinates.next(
            new google.maps.LatLng(data.coords.latitude, data.coords.longitude)
          );

          this.fireServiceOfficeMarker.setOptions({
            position: new google.maps.LatLng(
              data.coords.latitude,
              data.coords.longitude
            ),
            map: this.googleMap,
            icon: {
              url: '../../../../assets/icon/bd-fire-service.png',
            },
            title: 'Rafsun',
            animation: google.maps.Animation.DROP,
          });
          resolve(true);
        })
        .catch((error) => {
          console.log('Error getting location', error);
          this.generateInfoWindow(Infinity, false, Infinity);
        });
    });
  }

  private get getFireServiceCoordinates(): Observable<google.maps.LatLng> {
    return this._getFireServiceCoordinates.asObservable();
  }

  private get getDistanceMatrix() {
    return new Promise((resolve, reject) => {
      this.distanceMatrix.getDistanceMatrix(
        {
          destinations: [this.consumerCoordinates],
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
          durationInTraffic: true,
          origins: [this.fireServiceCoordinates],
        },
        (response, status) => {
          if (status === 'OK') {
            this._distanceMatrixObserver.next(response);
            resolve(true);
          }
        }
      );
    });
  }

  private consumerMarkerButton() {
    this.showToast('Getting user position!', 10000);
    this.generateInfoWindow(0, false, 10000);
  }

  private async generateInfoWindow(
    positionType: number = 0,
    isStart: boolean = false,
    tOut = Infinity
  ) {
    if (await this.getUserPosition(positionType, tOut)) {
      if (await this.getDistanceMatrix) {
        this.setInfoWindow();
        this.infoWindow.open(this.googleMap);
        if (isStart) {
          this.toggleLoading(false);
        }
        setTimeout(() => {
          document.getElementById('download').addEventListener('click', () => {
            this.pdfService.generatePDF(this.notificationDatum);
            this.showToast('Start Downloading....', 1500);
          });
        }, 1000);
      }
    }
  }

  toggleLoading(state: boolean) {
    if (state) {
      document.getElementById('mapLoading').style.display = '';
      document.getElementById('mapHeader').style.display = 'none';
      document.getElementById('mapContainer').style.display = 'none';
    } else {
      document.getElementById('mapLoading').style.display = 'none';
      document.getElementById('mapHeader').style.display = '';
      document.getElementById('mapContainer').style.display = '';
    }
  }

  navigate() {
    this.isNavigate = true;
    this.infoWindow.close();
    this.sliceDesOrigin();
    this.fireServiceMarker.setOptions({
      position: this.fireServiceCoordinates,
      map: this.googleMap,
      icon: {
        url: '../../../../assets/icon/fireman.png',
      },
    });

    this.directionsService.route(
      {
        destination: this.consumerCoordinates,
        origin: this.fireServiceCoordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === 'OK') {
          this.directionRenderer.setDirections(result);
          this.directionRenderer.setOptions({
            markerOptions: { visible: false },
            polylineOptions: {
              strokeColor: '#DD0000',
              strokeWeight: 7,
              strokeOpacity: 0.7,
            },
          });
        }
      }
    );
    this.fireServiceMarker.setMap(this.googleMap);
    this.directionRenderer.setMap(this.googleMap);
    document.getElementById('indicator').style.animation = 'indicatorDown';
    document.getElementById('indicator').style.animationDuration = '2.5s';
    document.getElementById('indicator').style.height = '100px';
    setTimeout(() => {
      document.getElementById(
        'durationInTraffic'
      ).style.color = this.trafficStyle;
    }, 1);
    setTimeout(() => {
      document.getElementById('indicator').style.position = 'fixed';
    }, 2500);
  }

  private sliceDesOrigin() {
    if (this.distanceMatrixData.destinationAddresses[0].length > 42) {
      this.shortDestination =
        this.distanceMatrixData.destinationAddresses[0].slice(0, 39) + '...';
    } else {
      this.shortDestination = this.distanceMatrixData.destinationAddresses[0];
    }
    if (this.distanceMatrixData.originAddresses[0].length > 42) {
      this.shortOrigin =
        this.distanceMatrixData.originAddresses[0].slice(0, 39) + '...';
    } else {
      this.shortOrigin = this.distanceMatrixData.originAddresses[0];
    }
    this.isMatrixAvailable = true;
  }

  private setInfoWindow() {
    let solvedBy = '';
    let solvedByDecorationStyle = '';
    let solvedByColorStyle = '';
    if (
      this.distanceMatrixData.rows[0].elements[0].duration_in_traffic.value >
      this.distanceMatrixData.rows[0].elements[0].duration.value
    ) {
      this.trafficStyle = 'red';
    } else {
      this.trafficStyle = 'green';
    }
    if (
      this.notificationDatum.solvedBy !== '' &&
      this.notificationDatum.solvedBy !== undefined &&
      this.notificationDatum.solvedBy !== null
    ) {
      solvedByDecorationStyle = 'underline';
      solvedByColorStyle = 'green';
      solvedBy = this.notificationDatum.solvedBy;
    } else {
      solvedByColorStyle = 'red';
      solvedByDecorationStyle = 'none';
      solvedBy = 'pending';
    }
    this.infoWindowInnerHTML = `
    <div style="padding: 0px;overflow: hidden;">
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <ion-avatar style="position: absolute;left: 50%;right: 50%;transform: translate(-50%, -50%);margin-top: 25px;">
              <img src="${
                this.consumerImagePath +
                this.notificationDatum.consumerData.imagePath
              }" alt="logo" width="50px" height="50px">
            </ion-avatar>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="5">
            <p style="margin-top: 50px;text-align: center;">
              From
            </p>
            <p style="margin-top: -12px;text-align: center;">
              <strong><em>${
                this.distanceMatrixData.originAddresses
              }</em></strong>
            </p>
          </ion-col>
          <ion-col size="2" style="padding: 0;">
            <div style="border-bottom: 1px solid #B0B3B5;transform: rotate(90deg);margin-top: 85px;padding: 0;"></div>
          </ion-col>
          <ion-col size="5">
            <p style="margin-top: 50px;text-align: center;">
              To
            </p>
            <p style="margin-top: -12px;text-align: center;">
              <strong><em>${
                this.distanceMatrixData.destinationAddresses
              }</em></strong>
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <p style="margin-top: -10px;text-align: center;">
              Distance Left
            </p>
            <p style="margin-top: -10px;text-align: center;">
              <strong style="color: red;"><em>${
                this.distanceMatrixData.rows[0].elements[0].distance.text
              }</em></strong>
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <p style="margin-top: -20px;">
              Average Arrival Time: <strong><em>${
                this.distanceMatrixData.rows[0].elements[0].duration.text
              }</em></strong>
            </p>
            <p style="margin-top: -10px;">
              In Today Traffic:
              <strong style="color: ${this.trafficStyle};">
                <em>${
                  this.distanceMatrixData.rows[0].elements[0]
                    .duration_in_traffic.text
                }</em>
              </strong>
            </p>
            <p style="margin-top: -10px;">
              Solved By:
              <strong style="color: ${solvedByColorStyle};text-decoration: ${solvedByDecorationStyle};">
                <em>${solvedBy}</em>
              </strong>
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" >
            <img height="24" width="24" src="../../../assets/icon/file-download-solid.svg" alt="navigate" style="float: right;" id="download">
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>`;

    this.infoWindow = new google.maps.InfoWindow({
      content: this.infoWindowInnerHTML,
      position: this.consumerCoordinates,
      pixelOffset: new google.maps.Size(0, -50),
    });
  }

  private async showToast(msg: string, time: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
    });
    toast.present();
  }
}
