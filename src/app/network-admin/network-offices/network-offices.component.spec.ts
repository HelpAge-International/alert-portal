import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkOfficesComponent } from './network-offices.component';

describe('NetworkOfficesComponent', () => {
  let component: NetworkOfficesComponent;
  let fixture: ComponentFixture<NetworkOfficesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkOfficesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
