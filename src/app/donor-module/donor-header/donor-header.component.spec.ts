import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorHeaderComponent } from './donor-header.component';

describe('DonorHeaderComponent', () => {
  let component: DonorHeaderComponent;
  let fixture: ComponentFixture<DonorHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
