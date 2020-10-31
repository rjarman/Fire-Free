import { Component, OnInit } from '@angular/core';
import { PopoverService } from '../services/popover.service';
import { Popover, CommonValues } from '../shared/popoverData';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit {

  notificationNumber: number;
  isNotification: boolean;

  constructor(private popoverService: PopoverService, private databaseService: DatabaseService) {
    this.databaseService.fetchNotification(true);
    this.databaseService.notificationNumber.subscribe(notificationNumber => {
      if (notificationNumber > 0) {
        this.notificationNumber = notificationNumber;
        this.isNotification = true;
      } else {
        this.isNotification = false;
      }
    });
  }

  ngOnInit() { }

  public showPopover(evnt: any) {
    this.popoverService.showPopover(new Popover<CommonValues>({event: evnt, popoverType: 'menu'}));
  }

}
