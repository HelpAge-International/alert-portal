import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAgencyValidationComponent } from './network-agency-validation.component';

describe('NetworkAgencyValidationComponent', () => {
  let component: NetworkAgencyValidationComponent;
  let fixture: ComponentFixture<NetworkAgencyValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAgencyValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAgencyValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
