import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificationPage } from './notification.page';

describe('NotificationPage', () => {
  let component: NotificationPage;
  let fixture: ComponentFixture<NotificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
