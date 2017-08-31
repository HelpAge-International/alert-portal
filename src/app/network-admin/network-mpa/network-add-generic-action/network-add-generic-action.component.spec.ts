import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAddGenericActionComponent } from './network-add-generic-action.component';

describe('NetworkAddGenericActionComponent', () => {
  let component: NetworkAddGenericActionComponent;
  let fixture: ComponentFixture<NetworkAddGenericActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAddGenericActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAddGenericActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
