import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCreateEditMessageComponent } from './network-create-edit-message.component';

describe('NetworkCreateEditMessageComponent', () => {
  let component: NetworkCreateEditMessageComponent;
  let fixture: ComponentFixture<NetworkCreateEditMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCreateEditMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCreateEditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
