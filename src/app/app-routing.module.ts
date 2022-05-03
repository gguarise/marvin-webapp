import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BaseCanDeactivateGuard,
  BaseTableCanDeactivateGuard,
} from './components/shared/guards/can-deactivate.guard';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { CadastroAgendamentoComponent } from './pages/agendamento/cadastro-agendamento/cadastro-agendamento.component';
import { CadastroClienteComponent } from './pages/cliente/cadastro-cliente/cadastro-cliente.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { FornecedorComponent } from './pages/fornecedor/fornecedor.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CadastroOrcamentoComponent } from './pages/orcamento/cadastro-orcamento/cadastro-orcamento.component';
import { OrcamentoComponent } from './pages/orcamento/orcamento.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { ServicoComponent } from './pages/servico/servico.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Caminho vazio vai para home
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'fornecedor',
    component: FornecedorComponent,
    canDeactivate: [BaseTableCanDeactivateGuard],
  },
  {
    path: 'estoque',
    component: ProdutoComponent,
    canDeactivate: [BaseTableCanDeactivateGuard],
  },
  {
    path: 'cliente',
    component: ClienteComponent,
  },
  {
    path: 'cadastro-cliente/:id',
    component: CadastroClienteComponent,
    canDeactivate: [BaseCanDeactivateGuard],
  },
  {
    path: 'cadastro-cliente',
    component: CadastroClienteComponent,
    canDeactivate: [BaseCanDeactivateGuard],
  },
  {
    path: 'servico',
    component: ServicoComponent,
    canDeactivate: [BaseTableCanDeactivateGuard],
  },
  {
    path: 'orcamento',
    component: OrcamentoComponent,
  },
  {
    path: 'cadastro-orcamento/:id',
    component: CadastroOrcamentoComponent,
    canDeactivate: [BaseCanDeactivateGuard],
  },
  {
    path: 'cadastro-orcamento',
    component: CadastroOrcamentoComponent,
    canDeactivate: [BaseCanDeactivateGuard],
  },
  {
    path: 'agendamento',
    component: AgendamentoComponent,
  },
  {
    path: 'cadastro-agendamento/:id',
    component: CadastroAgendamentoComponent,
    canDeactivate: [BaseCanDeactivateGuard],
  },
  {
    path: 'cadastro-agendamento',
    component: CadastroAgendamentoComponent,
    canDeactivate: [BaseCanDeactivateGuard],
  },
  { path: '**', redirectTo: 'home' }, // Deve ficar por último, vai procurando na ordem
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
