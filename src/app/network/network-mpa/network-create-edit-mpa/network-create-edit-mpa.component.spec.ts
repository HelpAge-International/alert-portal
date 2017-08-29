import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCreateEditMpaComponent } from './network-create-edit-mpa.component';

describe('NetworkCreateEditMpaComponent', () => {
  let component: NetworkCreateEditMpaComponent;
  let fixture: ComponentFixture<NetworkCreateEditMpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCreateEditMpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCreateEditMpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
