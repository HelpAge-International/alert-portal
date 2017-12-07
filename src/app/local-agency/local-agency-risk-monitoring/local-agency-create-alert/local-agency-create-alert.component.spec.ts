import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyCreateAlertComponent } from './local-agency-create-alert.component';

describe('LocalAgencyCreateAlertComponent', () => {
  let component: LocalAgencyCreateAlertComponent;
  let fixture: ComponentFixture<LocalAgencyCreateAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyCreateAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyCreateAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
