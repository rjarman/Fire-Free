import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { Registration } from 'src/app/shared/registration';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit, OnDestroy {

  private subscription: Subscription;

  private sendToServerData: Registration;

  constructor(private registrationService: RegistrationService, private toastController: ToastController, private router: Router) {
    this.subscription = this.registrationService.getStatus.subscribe( status => {
      if (status === 'success') {
        this.presentToast('<ion-icon name="checkbox-outline"></ion-icon> New user added successfully!');
        this.router.navigated = false;
        this.router.navigate(['/']);
      } else {
        this.presentToast('<ion-icon name="close"></ion-icon> Failed!');
      }
    });
   }

  ngOnInit() {
  }

  private setRegisterData(cName, cNumber, aCode, aOfRobot, cOfRobot) {
    this.sendToServerData = {
      consumerName: cName,
      contactNumber: cNumber,
      areaCode: +aCode,
      amountOfRobot: +aOfRobot,
      codeOfRobot: cOfRobot
    };
    this.register(this.sendToServerData);
  }

  private register(sendToServerData) {
    switch (this.registrationService.validation(sendToServerData)) {
      case 'ok': {
        this.registrationService.doRegistration(sendToServerData);
        break;
      }
      case 'error': {
        this.presentToast('Consumer\'s Name should be atleast 4 letters,!' +
        'Contact Number, Area Code, Amount of Robot, Code of Robot should be in \"+8801*********\", \"****\", ' +
        '\"***\" or \"****\", \"#******\" formate respectively!');
        break;
      }
    }
  }
  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
