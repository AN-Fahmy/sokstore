import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSettingComponent } from './employee-setting.component';

describe('EmployeeSettingComponent', () => {
  let component: EmployeeSettingComponent;
  let fixture: ComponentFixture<EmployeeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
