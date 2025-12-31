import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reward } from './reward';

describe('Reward', () => {
  let component: Reward;
  let fixture: ComponentFixture<Reward>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reward]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reward);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
