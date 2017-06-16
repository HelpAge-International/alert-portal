import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorAccountSettingsComponent } from './donor-account-settings.component';

describe('DonorAccountSettingsComponent', () => {
  let component: DonorAccountSettingsComponent;
  let fixture: ComponentFixture<DonorAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
