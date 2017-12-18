import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkGlobalMapListComponent } from './network-global-map-list.component';

describe('NetworkGlobalMapComponent', () => {
  let component: NetworkGlobalMapListComponent;
  let fixture: ComponentFixture<NetworkGlobalMapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkGlobalMapListComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGlobalMapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
