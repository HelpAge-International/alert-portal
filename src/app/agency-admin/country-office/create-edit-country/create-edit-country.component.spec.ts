import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCountryComponent } from './create-edit-country.component';

describe('CreateEditCountryComponent', () => {
  let component: CreateEditCountryComponent;
  let fixture: ComponentFixture<CreateEditCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
