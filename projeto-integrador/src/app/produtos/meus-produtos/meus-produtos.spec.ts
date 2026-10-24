import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusProdutos } from './meus-produtos';

describe('MeusProdutos', () => {
  let component: MeusProdutos;
  let fixture: ComponentFixture<MeusProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeusProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(MeusProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
