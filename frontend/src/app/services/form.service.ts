import { Injectable } from '@angular/core';
import { RegularExpressionList } from '../shared/validator';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormDataFormatter } from '../shared/formDataFormatter';
import { Subject, Observable } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  get isValidEmail(): boolean {
    return this._isValidEmail;
  }
  set isValidEmail(value: boolean) {
    this._isValidEmail = value;
  }
  get isNotValidEmail(): boolean {
    return this._isNotValidEmail;
  }
  set isNotValidEmail(value: boolean) {
    this._isNotValidEmail = value;
  }
  get isLoadingEmail(): boolean {
    return this._isLoadingEmail;
  }
  set isLoadingEmail(value: boolean) {
    this._isLoadingEmail = value;
  }
  get isValidUserName(): boolean {
    return this._isValidUserName;
  }
  set isValidUserName(value: boolean) {
    this._isValidUserName = value;
  }
  get isNotValidUserName(): boolean {
    return this._isNotValidUserName;
  }
  set isNotValidUserName(value: boolean) {
    this._isNotValidUserName = value;
  }
  get isLoadingUserName(): boolean {
    return this._isLoadingUserName;
  }
  set isLoadingUserName(value: boolean) {
    this._isLoadingUserName = value;
  }
  get isValidConsumerName(): boolean {
    return this._isValidConsumerName;
  }
  set isValidConsumerName(value: boolean) {
    this._isValidConsumerName = value;
  }
  get isNotValidConsumerName(): boolean {
    return this._isNotValidConsumerName;
  }
  set isNotValidConsumerName(value: boolean) {
    this._isNotValidConsumerName = value;
  }
  get isLoadingConsumerName(): boolean {
    return this._isLoadingConsumerName;
  }
  set isLoadingConsumerName(value: boolean) {
    this._isLoadingConsumerName = value;
  }
  get isValidContactNumber() {
    return this._isValidContactNumber;
  }
  set isValidContactNumber(value) {
    this._isValidContactNumber = value;
  }
  get isNotValidContactNumber() {
    return this._isNotValidContactNumber;
  }
  set isNotValidContactNumber(value) {
    this._isNotValidContactNumber = value;
  }
  get isLoadingContactNumber() {
    return this._isLoadingContactNumber;
  }
  set isLoadingContactNumber(value) {
    this._isLoadingContactNumber = value;
  }
  get isValidMACAddress() {
    return this._isValidMACAddress;
  }
  set isValidMACAddress(value) {
    this._isValidMACAddress = value;
  }
  get isNotValidMACAddress() {
    return this._isNotValidMACAddress;
  }
  set isNotValidMACAddress(value) {
    this._isNotValidMACAddress = value;
  }
  get isLoadingMACAddress() {
    return this._isLoadingMACAddress;
  }
  set isLoadingMACAddress(value) {
    this._isLoadingMACAddress = value;
  }

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private route: Router,
    private toastController: ToastController,
    private databaseService: DatabaseService
  ) {}
  set userEmail(email) {
    this._userEmail = email;
  }
  set servedBy(email) {
    this._servedBy = email;
  }
  get isRedirect(): Observable<boolean> {
    return this.redirectStatus.asObservable();
  }

  // Email
  private _isValidEmail: boolean;
  private _isNotValidEmail: boolean;
  private _isLoadingEmail: boolean;

  // User Name
  private _isValidUserName: boolean;
  private _isNotValidUserName: boolean;
  private _isLoadingUserName: boolean;

  // Consumer Name
  private _isValidConsumerName: boolean;
  private _isNotValidConsumerName: boolean;
  private _isLoadingConsumerName: boolean;

  // Contact Number
  private _isValidContactNumber;
  private _isNotValidContactNumber;
  private _isLoadingContactNumber;

  // MAC Address
  private _isValidMACAddress;
  private _isNotValidMACAddress;
  private _isLoadingMACAddress;

  private redirectStatus = new Subject<boolean>();

  private _userEmail;
  private _servedBy;

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
          isLoadingUserName: this.isLoadingUserName,
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
          isLoadingMACAddress: this.isLoadingMACAddress,
        };
      }
      case 'admin': {
        return {
          isValidUserName: this.isValidUserName,
          isNotValidUserName: this.isNotValidUserName,
          isLoadingUserName: this.isLoadingUserName,

          isValidContactNumber: this.isValidContactNumber,
          isNotValidContactNumber: this.isNotValidContactNumber,
          isLoadingContactNumber: this.isLoadingContactNumber,
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.email
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.userName
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.consumerName
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.contactNumber
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.macAddress
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.email
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.userName
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.consumerName
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.contactNumber
        );
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

        const regularExpressionList = new RegExp(
          RegularExpressionList.regExp.macAddress
        );
        if (regularExpressionList.test(value)) {
          this.isValidMACAddress = true;
          this.isNotValidMACAddress = false;
        } else {
          this.isValidMACAddress = false;
          this.isNotValidMACAddress = true;
        }
        break;
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

  formHandler(formData: FormDataFormatter) {
    const tempFormData = new FormData();
    const img = [];
    let tempImage: any;

    if (formData.hasImage && formData.formType !== 'admin') {
      tempImage = formData.imageData;
      tempImage = new File(
        tempImage,
        formData.textData.get('email').value.split('@')[0] + tempImage[0].name,
        { type: tempImage[0].type }
      );
      img.push(tempImage.name);
      tempFormData.append('images', tempImage);
      tempFormData.append('imagePath', JSON.stringify(img));
    } else if (formData.formType === 'admin') {
      if (
        formData.imageData === 'default' ||
        typeof formData.imageData === 'string'
      ) {
        if (formData.imageData === 'default') {
          tempImage = 'default';
        } else {
          tempImage = formData.imageData;
        }
        tempFormData.append('imagePath', JSON.stringify(tempImage));
      } else {
        console.log(formData.imageData);
        tempImage = formData.imageData;
        tempImage = new File(
          tempImage,
          this._userEmail.split('@')[0] + tempImage[0].name,
          { type: tempImage[0].type }
        );
        tempFormData.append('images', tempImage);
        tempFormData.append('imagePath', JSON.stringify(tempImage.name));
      }
    }

    switch (formData.formType) {
      case 'signup': {
        tempFormData.append(
          'userName',
          JSON.stringify(formData.textData.get('userName').value)
        );
        tempFormData.append(
          'email',
          JSON.stringify(formData.textData.get('email').value)
        );
        tempFormData.append(
          'password',
          JSON.stringify(formData.textData.get('password').value)
        );
        this.sendToServer(
          tempFormData,
          environment.custom.SIGNUP_URL,
          formData.formType
        );
        break;
      }
      case 'login': {
        tempFormData.append(
          'email',
          JSON.stringify(formData.textData.get('email').value)
        );
        tempFormData.append(
          'password',
          JSON.stringify(formData.textData.get('password').value)
        );
        this.sendToServer(
          tempFormData,
          environment.custom.LOGIN_URL,
          formData.formType
        );
        break;
      }
      case 'consumerReg': {
        tempFormData.append(
          'consumerName',
          JSON.stringify(formData.textData.get('consumerName').value)
        );
        tempFormData.append(
          'email',
          JSON.stringify(formData.textData.get('email').value)
        );
        tempFormData.append(
          'contactNumber',
          JSON.stringify(formData.textData.get('contactNumber').value)
        );
        tempFormData.append(
          'macAddress',
          JSON.stringify(formData.textData.get('macAddress').value)
        );
        tempFormData.append('servedBy', JSON.stringify(this._servedBy));
        this.sendToServer(
          tempFormData,
          environment.custom.REGISTRATION_URL,
          formData.formType
        );
        break;
      }
      case 'admin': {
        tempFormData.append('email', JSON.stringify(this._userEmail));
        tempFormData.append(
          'userName',
          JSON.stringify(formData.textData.get('userName').value)
        );
        tempFormData.append(
          'gender',
          JSON.stringify(formData.textData.get('gender').value)
        );
        tempFormData.append(
          'contactNumber',
          JSON.stringify(formData.textData.get('contactNumber').value)
        );
        tempFormData.append(
          'branch',
          JSON.stringify(formData.textData.get('branch').value)
        );
        tempFormData.append(
          'designation',
          JSON.stringify(formData.textData.get('designation').value)
        );
        this.sendToServer(
          tempFormData,
          environment.custom.ADMIN_URL,
          formData.formType
        );
        break;
      }
    }
  }

  private sendToServer(formData: FormData, url: string, formType: string) {
    this.httpClient
      .post<{ data: string; status: string }>(url, formData, {
        observe: 'response',
      })
      .subscribe((response) => {
        if (response.body.status === 'ok') {
          switch (formType) {
            case 'consumerReg': {
              this.showToast(
                '<ion-icon name="checkbox-outline"></ion-icon> New user added successfully!'
              );
              this.route.navigate(['/']);
              break;
            }
            case 'admin': {
              this.showToast(
                '<ion-icon name="checkbox-outline"></ion-icon> Data has been updated successfully!'
              );
              this.databaseService.fetchData();
              this.route.navigate(['/menus/profile']);
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
                this.showToast("Password doesn't match!");
              }
              break;
            }
            case 'consumerReg': {
              if (response.body.status === 'registered') {
                this.redirectStatus.next(false);
                this.showToast(
                  `<ion-icon name="close"></ion-icon> \'${formData.get(
                    'macAddress'
                  )}\' is already registered to ${response.body.data}!`
                );
              } else {
                this.showToast(
                  '<ion-icon name="close"></ion-icon> Registration Failed!'
                );
              }
              break;
            }
            case 'admin': {
              if (response.body.status === '!modified') {
              }
              break;
            }
            default: {
              this.showToast('Data update failed!');
              break;
            }
          }
        }
      });
  }

  resetAllValidators() {
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

  private async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
    });
    toast.present();
  }
}
