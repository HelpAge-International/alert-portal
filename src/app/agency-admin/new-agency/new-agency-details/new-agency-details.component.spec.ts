import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgencyDetailsComponent } from './new-agency-details.component';

describe('NewAgencyDetailsComponent', () => {
  let component: NewAgencyDetailsComponent;
  let fixture: ComponentFixture<NewAgencyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAgencyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAgencyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
