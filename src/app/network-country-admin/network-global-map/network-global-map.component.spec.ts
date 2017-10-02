import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkGlobalMapComponent } from './network-global-map.component';

describe('NetworkGlobalMapComponent', () => {
  let component: NetworkGlobalMapComponent;
  let fixture: ComponentFixture<NetworkGlobalMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkGlobalMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGlobalMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
