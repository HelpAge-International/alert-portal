import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkCoordinationAddEditComponent } from './local-network-coordination-add-edit.component';

describe('LocalNetworkCoordinationAddEditComponent', () => {
  let component: LocalNetworkCoordinationAddEditComponent;
  let fixture: ComponentFixture<LocalNetworkCoordinationAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkCoordinationAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkCoordinationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
