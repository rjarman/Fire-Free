import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenusPage } from './menus.page';

describe('MenusPage', () => {
  let component: MenusPage;
  let fixture: ComponentFixture<MenusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
