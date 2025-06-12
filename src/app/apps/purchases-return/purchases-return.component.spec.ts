import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesReturnComponent } from './purchases-return.component';

describe('PurchasesReturnComponent', () => {
  let component: PurchasesReturnComponent;
  let fixture: ComponentFixture<PurchasesReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesReturnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
