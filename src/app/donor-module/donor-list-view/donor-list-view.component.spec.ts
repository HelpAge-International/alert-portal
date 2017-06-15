import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorListViewComponent } from './donor-list-view.component';

describe('DonorListViewComponent', () => {
  let component: DonorListViewComponent;
  let fixture: ComponentFixture<DonorListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
