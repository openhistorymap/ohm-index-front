import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreadisplayComponent } from './areadisplay.component';

describe('AreadisplayComponent', () => {
  let component: AreadisplayComponent;
  let fixture: ComponentFixture<AreadisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreadisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreadisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
