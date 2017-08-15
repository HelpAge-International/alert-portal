import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkHeaderComponent } from './network-header.component';

describe('NetworkHeaderComponent', () => {
  let component: NetworkHeaderComponent;
  let fixture: ComponentFixture<NetworkHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
