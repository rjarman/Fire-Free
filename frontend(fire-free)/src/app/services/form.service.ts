import { Injectable } from '@angular/core';
import { RegularExpressionList } from '../shared/validator';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Login } from '../shared/login';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { FormDataFormatter } from '../shared/formDataFormatter';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  // Email
  private _isValidEmail: boolean;
  public get isValidEmail(): boolean {
    return this._isValidEmail;
  }
  public set isValidEmail(value: boolean) {
    this._isValidEmail = value;
  }
  private _isNotValidEmail: boolean;
  public get isNotValidEmail(): boolean {
    return this._isNotValidEmail;
  }
  public set isNotValidEmail(value: boolean) {
    this._isNotValidEmail = value;
  }
  private _isLoadingEmail: boolean;
  public get isLoadingEmail(): boolean {
    return this._isLoadingEmail;
  }
  public set isLoadingEmail(value: boolean) {
    this._isLoadingEmail = value;
  }

  // User Name
  private _isValidUserName: boolean;
  public get isValidUserName(): boolean {
    return this._isValidUserName;
  }
  public set isValidUserName(value: boolean) {
    this._isValidUserName = value;
  }
  private _isNotValidUserName: boolean;
  public get isNotValidUserName(): boolean {
    return this._isNotValidUserName;
  }
  public set isNotValidUserName(value: boolean) {
    this._isNotValidUserName = value;
  }
  private _isLoadingUserName: boolean;
  public get isLoadingUserName(): boolean {
    return this._isLoadingUserName;
  }
  public set isLoadingUserName(value: boolean) {
    this._isLoadingUserName = value;
  }

  // Consumer Name
  private _isValidConsumerName: boolean;
  public get isValidConsumerName(): boolean {
    return this._isValidConsumerName;
  }
  public set isValidConsumerName(value: boolean) {
    this._isValidConsumerName = value;
  }
  private _isNotValidConsumerName: boolean;
  public get isNotValidConsumerName(): boolean {
    return this._isNotValidConsumerName;
  }
  public set isNotValidConsumerName(value: boolean) {
    this._isNotValidConsumerName = value;
  }
  private _isLoadingConsumerName: boolean;
  public get isLoadingConsumerName(): boolean {
    return this._isLoadingConsumerName;
  }
  public set isLoadingConsumerName(value: boolean) {
    this._isLoadingConsumerName = value;
  }

  // Contact Number
  private _isValidContactNumber;
  public get isValidContactNumber() {
    return this._isValidContactNumber;
  }
  public set isValidContactNumber(value) {
    this._isValidContactNumber = value;
  }
  private _isNotValidContactNumber;
  public get isNotValidContactNumber() {
    return this._isNotValidContactNumber;
  }
  public set isNotValidContactNumber(value) {
    this._isNotValidContactNumber = value;
  }
  private _isLoadingContactNumber;
  public get isLoadingContactNumber() {
    return this._isLoadingContactNumber;
  }
  public set isLoadingContactNumber(value) {
    this._isLoadingContactNumber = value;
  }

  // MAC Address
  private _isValidMACAddress;
  public get isValidMACAddress() {
    return this._isValidMACAddress;
  }
  public set isValidMACAddress(value) {
    this._isValidMACAddress = value;
  }
  private _isNotValidMACAddress;
  public get isNotValidMACAddress() {
    return this._isNotValidMACAddress;
  }
  public set isNotValidMACAddress(value) {
    this._isNotValidMACAddress = value;
  }
  private _isLoadingMACAddress;
  public get isLoadingMACAddress() {
    return this._isLoadingMACAddress;
  }
  public set isLoadingMACAddress(value) {
    this._isLoadingMACAddress = value;
  }

  private redirectStatus = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private route: Router,
    private toastController: ToastController
  ) { }

/***
 *              _______  _       _________ ______   _______ __________________ _______  _
 *    |\     /|(  ___  )( \      \__   __/(  __  \ (  ___  )\__   __/\__   __/(  ___  )( (    /|
 *    | )   ( || (   ) || (         ) (   | (  \  )| (   ) |   ) (      ) (   | (   ) ||  \  ( |
 *    | |   | || (___) || |         | |   | |   ) || (___) |   | |      | |   | |   | ||   \ | |
 *    ( (   ) )|  ___  || |         | |   | |   | ||  ___  |   | |      | |   | |   | || (\ \) |
 *     \ \_/ / | (   ) || |         | |   | |   ) || (   ) |   | |      | |   | |   | || | \   |
 *      \   /  | )   ( || (____/\___) (___| (__/  )| )   ( |   | |   ___) (___| (___) || )  \  |
 *       \_/   |/     \|(_______/\_______/(______/ |/     \|   )_(   \_______/(_______)|/    )_)
 *
 */


  getAllVariables(formType) {
    switch (formType) {
      case 'log-reg': {
        return {
          isValidEmail: this.isValidEmail,
          isNotValidEmail: this.isNotValidEmail,
          isLoadingEmail: this.isLoadingEmail,

          isValidUserName: this.isValidUserName,
          isNotValidUserName: this.isNotValidUserName,
          isLoadingUserName: this.isLoadingUserName
        };
      }
      case 'consumerReg': {
        return {
          isValidEmail: this.isValidEmail,
          isNotValidEmail: this.isNotValidEmail,
          isLoadingEmail: this.isLoadingEmail,

          isValidConsumerName: this.isValidConsumerName,
          isNotValidConsumerName: this.isNotValidConsumerName,
          isLoadingConsumerName: this.isLoadingConsumerName,

          isValidContactNumber: this.isValidContactNumber,
          isNotValidContactNumber: this.isNotValidContactNumber,
          isLoadingContactNumber: this.isLoadingContactNumber,

          isValidMACAddress: this.isValidMACAddress,
          isNotValidMACAddress: this.isNotValidMACAddress,
          isLoadingMACAddress: this.isLoadingMACAddress
        };
      }
    }
  }

  focused(valueType: string, value: string) {
    switch (valueType) {
      case 'email': {
        this.isValidEmail = false;
        this.isNotValidEmail = false;
        this.isLoadingEmail = true;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.email);
        if (regularExpressionList.test(value)) {
          this.isLoadingEmail = false;
          this.isValidEmail = true;
          this.isNotValidEmail = false;
        } else {
          this.isValidEmail = false;
        }
        break;
      }
      case 'userName': {
        this.isValidUserName = false;
        this.isNotValidUserName = false;
        this.isLoadingUserName = true;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.userName);
        if (regularExpressionList.test(value)) {
          this.isLoadingUserName = false;
          this.isValidUserName = true;
          this.isNotValidUserName = false;
        } else {
          this.isValidUserName = false;
        }
        break;
      }
      case 'consumerName': {
        this.isValidConsumerName = false;
        this.isNotValidConsumerName = false;
        this.isLoadingConsumerName = true;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.consumerName);
        if (regularExpressionList.test(value)) {
          this.isLoadingConsumerName = false;
          this.isValidConsumerName = true;
          this.isNotValidConsumerName = false;
        } else {
          this.isValidConsumerName = false;
        }
        break;
      }
      case 'contactNumber': {
        this.isValidContactNumber = false;
        this.isNotValidContactNumber = false;
        this.isLoadingContactNumber = true;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.contactNumber);
        if (regularExpressionList.test(value)) {
          this.isLoadingContactNumber = false;
          this.isValidContactNumber = true;
          this.isNotValidContactNumber = false;
        } else {
          this.isValidContactNumber = false;
        }
        break;
      }
      case 'macAddress': {
        this.isValidMACAddress = false;
        this.isNotValidMACAddress = false;
        this.isLoadingMACAddress = true;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.macAddress);
        if (regularExpressionList.test(value)) {
          this.isLoadingMACAddress = false;
          this.isValidMACAddress = true;
          this.isNotValidMACAddress = false;
        } else {
          this.isValidMACAddress = false;
        }
        break;
      }
    }
  }

  notFocused(valueType: string, value: string) {
    switch (valueType) {
      case 'email': {
        this.isValidEmail = false;
        this.isNotValidEmail = false;
        this.isLoadingEmail = false;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.email);
        if (regularExpressionList.test(value)) {
          this.isValidEmail = true;
          this.isNotValidEmail = false;
        } else {
          this.isValidEmail = false;
          this.isNotValidEmail = true;
        }
        break;
      }
      case 'userName': {
        this.isValidUserName = false;
        this.isNotValidUserName = false;
        this.isLoadingUserName = false;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.userName);
        if (regularExpressionList.test(value)) {
          this.isValidUserName = true;
          this.isNotValidUserName = false;
        } else {
          this.isValidUserName = false;
          this.isNotValidUserName = true;
        }
        break;
      }
      case 'consumerName': {
        this.isValidConsumerName = false;
        this.isNotValidConsumerName = false;
        this.isLoadingConsumerName = false;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.consumerName);
        if (regularExpressionList.test(value)) {
          this.isValidConsumerName = true;
          this.isNotValidConsumerName = false;
        } else {
          this.isValidConsumerName = false;
          this.isNotValidConsumerName = true;
        }
        break;
      }
      case 'contactNumber': {
        this.isValidContactNumber = false;
        this.isNotValidContactNumber = false;
        this.isLoadingContactNumber = false;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.contactNumber);
        if (regularExpressionList.test(value)) {
          this.isValidContactNumber = true;
          this.isNotValidContactNumber = false;
        } else {
          this.isValidContactNumber = false;
          this.isNotValidContactNumber = true;
        }
        break;
      }
      case 'macAddress': {
        this.isValidMACAddress = false;
        this.isNotValidMACAddress = false;
        this.isLoadingMACAddress = false;

        const regularExpressionList = new RegExp(RegularExpressionList.regExp.macAddress);
        if (regularExpressionList.test(value)) {
          this.isValidMACAddress = true;
          this.isNotValidMACAddress = false;
        } else {
          this.isValidMACAddress = false;
          this.isNotValidMACAddress = true;
        }
        break;
      }
      default: {
        this.isValidEmail = false;
        this.isNotValidEmail = false;
        this.isLoadingEmail = false;

        this.isValidConsumerName = false;
        this.isNotValidConsumerName = false;
        this.isLoadingConsumerName = false;

        this.isValidContactNumber = false;
        this.isNotValidContactNumber = false;
        this.isLoadingContactNumber = false;

        this.isValidMACAddress = false;
        this.isNotValidMACAddress = false;
        this.isLoadingMACAddress = false;
      }
    }
  }

/***
 *     _______  _______  _______  _______                  _______  _        ______   _       _________ _        _______
 *    (  ____ \(  ___  )(  ____ )(       )       |\     /|(  ___  )( (    /|(  __  \ ( \      \__   __/( (    /|(  ____ \
 *    | (    \/| (   ) || (    )|| () () |       | )   ( || (   ) ||  \  ( || (  \  )| (         ) (   |  \  ( || (    \/
 *    | (__    | |   | || (____)|| || || | _____ | (___) || (___) ||   \ | || |   ) || |         | |   |   \ | || |
 *    |  __)   | |   | ||     __)| |(_)| |(_____)|  ___  ||  ___  || (\ \) || |   | || |         | |   | (\ \) || | ____
 *    | (      | |   | || (\ (   | |   | |       | (   ) || (   ) || | \   || |   ) || |         | |   | | \   || | \_  )
 *    | )      | (___) || ) \ \__| )   ( |       | )   ( || )   ( || )  \  || (__/  )| (____/\___) (___| )  \  || (___) |
 *    |/       (_______)|/   \__/|/     \|       |/     \||/     \||/    )_)(______/ (_______/\_______/|/    )_)(_______)
 *
 */

 public formHandler(formData: FormDataFormatter) {
  const tempFormData = new FormData();
  const img = [];
  let tempImage: any;

  if (formData.hasImage) {
    tempImage = formData.imageData;
    tempImage = new File(
      tempImage,
      formData.textData.get('email').value.split('@')[0] + tempImage[0].name,
      {type: tempImage[0].type}
    );
    img.push(tempImage.name);
    tempFormData.append('images', tempImage);
    tempFormData.append('imagePath', JSON.stringify(img));
  }

  switch (formData.formType) {
    case 'signup': {
      tempFormData.append('userName', JSON.stringify(formData.textData.get('userName').value));
      tempFormData.append('email', JSON.stringify(formData.textData.get('email').value));
      tempFormData.append('password', JSON.stringify(formData.textData.get('password').value));
      this.sendToServer(tempFormData, environment.custom.SIGNUP_URL, formData.formType);
      break;
    }
    case 'login': {
      tempFormData.append('email', JSON.stringify(formData.textData.get('email').value));
      tempFormData.append('password', JSON.stringify(formData.textData.get('password').value));
      this.sendToServer(tempFormData, environment.custom.LOGIN_URL, formData.formType);
      break;
    }
    case 'consumerReg': {
      tempFormData.append('consumerName', JSON.stringify(formData.textData.get('consumerName').value));
      tempFormData.append('email', JSON.stringify(formData.textData.get('email').value));
      tempFormData.append('contactNumber', JSON.stringify(formData.textData.get('contactNumber').value));
      tempFormData.append('macAddress', JSON.stringify(formData.textData.get('macAddress').value));
      this.sendToServer(tempFormData, environment.custom.REGISTRATION_URL, formData.formType);
      break;
    }
  }
 }

 private sendToServer(formData: FormData, url: string, formType: string) {
  this.httpClient.post<{data: string, status: string}>(url, formData, {observe: 'response'}).subscribe(response => {

    if (response.body.status === 'ok') {
      switch (formType) {
        case 'consumerReg': {
          this.showToast('<ion-icon name="checkbox-outline"></ion-icon> New user added successfully!');
          // this.route.navigated = false;
          this.route.navigate(['/']);
          break;
        }
        default: {
          if (this.cookieService.check('email')) {
            this.cookieService.deleteAll();
          }
          this.cookieService.set('email', response.body.data);
          this.cookieService.set('isLoggedIn', 'true');
          this.route.navigate(['/']);
          break;
        }
      }
    } else {
      switch (formType) {
        case 'signup': {
          this.showToast(`${response.body.data} is already registered!`);
          break;
        }
        case 'login': {
          if (response.body.status === '!registered') {
            this.showToast(`${response.body.data} isn't registered!`);
          } else {
            this.showToast('Password doesn\'t match!');
          }
          break;
        }
        case 'consumerReg': {
          if (response.body.status === 'registered') {
            this.redirectStatus.next(false);
            this.showToast(`<ion-icon name="close"></ion-icon> \'${formData.get('macAddress')}\' is already registered to ${response.body.data}!`);
          } else {
            this.showToast('<ion-icon name="close"></ion-icon> Registration Failed!');
          }
        }
      }
    }
  });
 }

  public resetAllValidators() {
    this.isValidUserName = false;
    this.isNotValidUserName = false;
    this.isLoadingUserName = false;

    this.isValidEmail = false;
    this.isNotValidEmail = false;
    this.isLoadingEmail = false;

    this.isValidConsumerName = false;
    this.isNotValidConsumerName = false;
    this.isLoadingConsumerName = false;

    this.isValidMACAddress = false;
    this.isNotValidMACAddress = false;
    this.isLoadingMACAddress = false;

    this.isValidContactNumber = false;
    this.isNotValidContactNumber = false;
    this.isLoadingContactNumber = false;

  }

  get isRedirect(): Observable<boolean> {
    return this.redirectStatus.asObservable();
  }



  private async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500
    });
    toast.present();
  }
}
