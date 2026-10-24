import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroVendedor } from './cadastro-vendedor';

describe('CadastroVendedor', () => {
  let component: CadastroVendedor;
  let fixture: ComponentFixture<CadastroVendedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroVendedor],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroVendedor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
