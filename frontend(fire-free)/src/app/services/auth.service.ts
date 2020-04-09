import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Login } from '../shared/login';
import { CookieService } from 'ngx-cookie-service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private route: Router,
    private toastController: ToastController
  ) {}

  public register(registerForm: any, profilePhoto: any) {

    const tempFormData = new FormData();
    const img = [];
    console.log(profilePhoto);
    profilePhoto = new File(
      profilePhoto,
      registerForm.get('email').value.split('@')[0] + profilePhoto[0].name,
      {type: profilePhoto[0].type}
    );
    console.log(profilePhoto);

    img.push(profilePhoto.name);
    tempFormData.append('images', profilePhoto);
    tempFormData.append('imagePath', JSON.stringify(img));

    tempFormData.append('userName', JSON.stringify(registerForm.get('userName').value));
    tempFormData.append('email', JSON.stringify(registerForm.get('email').value));
    tempFormData.append('password', JSON.stringify(registerForm.get('password').value));
    // console.log(tempFormData);
    // tslint:disable-next-line: max-line-length
    this.httpClient.post<{data: string, status: string}>(environment.custom.SIGNUP_URL, tempFormData, {observe: 'response'}).subscribe(response => {
      if (response.body.status === 'ok') {
        if (this.cookieService.check('email')) {
          this.cookieService.deleteAll();
        }
        this.cookieService.set('email', response.body.data);
        this.cookieService.set('isLoggedIn', 'true');
        this.route.navigate(['/']);
      } else {
        this.showToast(`${response.body.data} is already registered!`);
      }
    });
  }

  public addUserFormToDatabase() {
  }
  public login(loginData: Login) {
    // tslint:disable-next-line: max-line-length
    this.httpClient.post<{data: string, status: string}>(environment.custom.LOGIN_URL, loginData, {observe: 'response'}).subscribe(response => {
      if (response.body.status === 'ok') {
        if (this.cookieService.check('email')) {
          this.cookieService.deleteAll();
        }
        this.cookieService.set('email', response.body.data);
        this.cookieService.set('isLoggedIn', 'true');
        this.route.navigate(['/']);
      } else if (response.body.status === '!registered') {
        this.showToast(`${response.body.data} isn't registered!`);
      } else {
        this.showToast('Password doesn\'t match!');
      }
    });
  }

  private async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500
    });
    toast.present();
  }

}
