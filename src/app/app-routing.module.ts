import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroClienteComponent } from './pages/cliente/cadastro-cliente/cadastro-cliente.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { FornecedorComponent } from './pages/fornecedor/fornecedor.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { ServicoComponent } from './pages/servico/servico.component';

const routes: Routes = [
  // { path: '**', component:  }, // TODO PageNotFoundComponent
  { path: 'fornecedor', component: FornecedorComponent },
  { path: 'estoque', component: ProdutoComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'cadastro-cliente/:id', component: CadastroClienteComponent },
  { path: 'cadastro-cliente', component: CadastroClienteComponent },
  { path: 'servico', component: ServicoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
