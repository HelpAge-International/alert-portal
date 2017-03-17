import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyMpaComponent } from './agency-mpa.component';

describe('AgencyMpaComponent', () => {
  let component: AgencyMpaComponent;
  let fixture: ComponentFixture<AgencyMpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyMpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyMpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
