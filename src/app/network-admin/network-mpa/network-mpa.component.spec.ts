import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkMpaComponent } from './network-mpa.component';

describe('NetworkMpaComponent', () => {
  let component: NetworkMpaComponent;
  let fixture: ComponentFixture<NetworkMpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkMpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkMpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
