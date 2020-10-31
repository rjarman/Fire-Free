import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from '../menus/popover/popover.page';
import { CommonValues, Popover } from '../types';

@Injectable({
  providedIn: 'root',
})
export class PopoverService {
  constructor(private popoverController: PopoverController) {}

  async showPopover(commonValues: Popover<CommonValues>, _data?: any) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: commonValues.popoverData.event,
      translucent: true,
      componentProps: {
        popoverType: commonValues.popoverData.popoverType,
        data: _data,
      },
    });
    return await popover.present();
  }
}
