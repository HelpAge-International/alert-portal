import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNetworkOfficeComponent } from './add-edit-network-office.component';

describe('AddEditNetworkOfficeComponent', () => {
  let component: AddEditNetworkOfficeComponent;
  let fixture: ComponentFixture<AddEditNetworkOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditNetworkOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditNetworkOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
