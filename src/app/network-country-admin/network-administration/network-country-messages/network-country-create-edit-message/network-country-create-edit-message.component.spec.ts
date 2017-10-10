import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryCreateEditMessageComponent } from './network-country-create-edit-message.component';

describe('NetworkCountryCreateEditMessageComponent', () => {
  let component: NetworkCountryCreateEditMessageComponent;
  let fixture: ComponentFixture<NetworkCountryCreateEditMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryCreateEditMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryCreateEditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
