import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOperationsComponent } from './sales-operations.component';

describe('SalesOperationsComponent', () => {
  let component: SalesOperationsComponent;
  let fixture: ComponentFixture<SalesOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
