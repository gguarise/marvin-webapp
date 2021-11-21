import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FornecedorComponent } from './pages/fornecedor/fornecedor.component';
import { ProdutoComponent } from './pages/produto/produto.component';

const routes: Routes = [
  { path: 'fornecedor', component: FornecedorComponent },
  { path: 'produto', component: ProdutoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
