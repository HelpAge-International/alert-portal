import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileMenuComponent } from './local-network-profile-menu.component';

describe('LocalNetworkProfileMenuComponent', () => {
  let component: LocalNetworkProfileMenuComponent;
  let fixture: ComponentFixture<LocalNetworkProfileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
