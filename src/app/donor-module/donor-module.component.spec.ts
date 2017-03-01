import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorModuleComponent } from './donor-module.component';

describe('DonorModuleComponent', () => {
  let component: DonorModuleComponent;
  let fixture: ComponentFixture<DonorModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
