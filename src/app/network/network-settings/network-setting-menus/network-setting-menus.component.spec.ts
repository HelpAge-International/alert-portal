import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSettingMenusComponent } from './network-setting-menus.component';

describe('NetworkSettingMenusComponent', () => {
  let component: NetworkSettingMenusComponent;
  let fixture: ComponentFixture<NetworkSettingMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkSettingMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSettingMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
