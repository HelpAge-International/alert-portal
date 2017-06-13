import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorMenuComponent } from './donor-menu.component';

describe('DonorMenuComponent', () => {
  let component: DonorMenuComponent;
  let fixture: ComponentFixture<DonorMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
