import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorCountryIndexComponent } from './donor-country-index.component';

describe('DonorCountryIndexComponent', () => {
  let component: DonorCountryIndexComponent;
  let fixture: ComponentFixture<DonorCountryIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorCountryIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorCountryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
