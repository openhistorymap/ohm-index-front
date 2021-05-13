import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreadetailComponent } from './areadetail.component';

describe('AreadetailComponent', () => {
  let component: AreadetailComponent;
  let fixture: ComponentFixture<AreadetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreadetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreadetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
