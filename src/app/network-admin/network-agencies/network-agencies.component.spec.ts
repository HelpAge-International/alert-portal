import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAgenciesComponent } from './network-agencies.component';

describe('NetworkAgenciesComponent', () => {
  let component: NetworkAgenciesComponent;
  let fixture: ComponentFixture<NetworkAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
