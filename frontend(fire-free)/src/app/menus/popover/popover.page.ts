import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, AlertController } from '@ionic/angular';
import { PopoverDatum } from 'src/app/shared/popoverData';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  popoverData: PopoverDatum;

  constructor(
    private navParams: NavParams,
    private router: Router,
    private cookieService: CookieService,
    private popoverController: PopoverController,
    private alertController: AlertController
  ) {
    this.popoverData = new PopoverDatum(this.navParams.data.id, this.navParams.data.popoverType);
  }

  ngOnInit() {
    if (this.popoverData.popoverType === 'menu') {
      // this.isMenu = true;
      document.getElementById('popover').innerHTML = `
      <ion-item button id="profile">
        <img src="../../../../../assets/icon/person-24px.svg" alt="" style="margin-right: 8px;">Profile
      </ion-item>
      <ion-item button id="about">
        <img src="../../../../../assets/icon/info-black-24dp.svg" alt="" style="margin-right: 8px;">About
      </ion-item>
      <ion-item button lines="none" id="logout"">
        <img src="../../../../../assets/icon/exit_to_app-black-24dp.svg" alt="" style="margin-right: 8px;">Logout
      </ion-item>`;
      this.setListeners();
    }
  }

  async showAbout() {
    const about = await this.alertController.create({
      header: 'Fire-Free',
      message: 'Fire-Free'
    });
    const headerID = document.getElementsByClassName('alert-head')[0].getElementsByTagName('h2')[0].id;
    const msgID = document.getElementsByClassName('alert-message')[0].id;
    document.getElementById(headerID).style.textAlign = 'center';
    document.getElementById(headerID).innerHTML = `
    <img src="../../../assets/icon/fire-free.png" alt="logo" width="50px" height="50px">
    <p style="font-family: 'Courier New', Courier, monospace;margin-top: -5px;"><strong><em>Fire-Free</em></strong></p>
    <p style="font-size: 12px;font-family: 'Courier New', Courier, monospace;margin-top: -20px;">v1.9.7a Beta</p>
    <hr style="border-top: 1px solid #B0B3B5;">`;

    document.getElementById(msgID).innerHTML = `
    <div style="text-align: center;margin-top: -10px;">
        <p style="font-size: 14px;">
            This application is specially designed for Fire-Free hardware project. Details of everything is given as the link below.
        </p>
        <p style="font-size: 12px; color: #B0B3B5;">Follow me on social media</p>
        <img id="facebook" src="../../../assets/icon/facebook-brands.svg" alt="facebook" width="25px" height="25px" style="margin-right: 5px;">
        <img id="blog" src="../../../assets/icon/blog-solid.svg" alt="blog" width="25px" height="25px" style="margin-right: 5px;">
        <img id="github" src="../../../assets/icon/github-brands.svg" alt="git" width="25px" height="25px" style="margin-right: 5px;">
        <img id="linkedin" src="../../../assets/icon/linkedin-brands.svg" alt="linkedin" width="25px" height="25px">
    </div>`;
    this.setSocialListeners();
    await about.present();
  }

  private setListeners() {
    if (this.popoverData.popoverType === 'menu') {
      document.getElementById('profile').addEventListener('click', (e: Event) => {
        this.popoverController.dismiss();
        this.router.navigate(['/menus/profile']);
      });
      document.getElementById('about').addEventListener('click', (e: Event) => {
        this.popoverController.dismiss();
        this.showAbout();
      });
      document.getElementById('logout').addEventListener('click', (e: Event) => {
        this.popoverController.dismiss();
        this.cookieService.delete('isLoggedIn');
        this.cookieService.set('isLoggedIn', 'false');
        this.router.navigate(['/auth']);
      });
    }
  }

  private setSocialListeners() {
    document.getElementById('facebook').addEventListener('click', (e: Event) => {
      window.open(environment.custom.SOCIAL.FACEBOOK);
    });
    document.getElementById('blog').addEventListener('click', (e: Event) => {
      window.open(environment.custom.SOCIAL.BLOG);
    });
    document.getElementById('github').addEventListener('click', (e: Event) => {
      window.open(environment.custom.SOCIAL.GIT);
    });
    document.getElementById('linkedin').addEventListener('click', (e: Event) => {
      window.open(environment.custom.SOCIAL.LINKEDIN);
    });
  }

}
