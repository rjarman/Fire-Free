import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from './popover/popover.page';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  async showPopover(evnt: any, id: string) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: evnt,
      translucent: true,
      componentProps: {data: id}
    });
    return await popover.present();
  }

}
