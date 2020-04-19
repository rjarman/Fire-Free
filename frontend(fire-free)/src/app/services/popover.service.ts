import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from '../menus/popover/popover.page';
import { PopoverData } from '../shared/popoverData';

@Injectable({
  providedIn: 'root',
})
export class PopoverService {

  constructor(private popoverController: PopoverController) { }

  async showPopover(data: PopoverData) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: data.event,
      translucent: true,
      componentProps: {id: data.id, popoverType: data.popoverType}
    });
    return await popover.present();
  }
}
