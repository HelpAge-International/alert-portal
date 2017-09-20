import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileContactsComponent } from './local-network-profile-contacts.component';

describe('LocalNetworkProfileContactsComponent', () => {
  let component: LocalNetworkProfileContactsComponent;
  let fixture: ComponentFixture<LocalNetworkProfileContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
