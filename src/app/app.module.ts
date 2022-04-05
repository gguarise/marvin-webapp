import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FornecedorComponent } from './pages/fornecedor/fornecedor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageHeaderComponent } from './components/templates/page-header/page-header.component';
import { BaseComponent } from './components/base/base.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from './components/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { TextMaskModule } from 'angular2-text-mask';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { OrcamentoComponent } from './pages/orcamento/orcamento.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { ProdutoTableComponent } from './pages/orcamento/cadastro-orcamento/produto-table/produto-table.component';
import { PecasTableComponent } from './pages/orcamento/cadastro-orcamento/pecas-table/pecas-table.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AppInjectorService } from './services/app-injector.service';
import { TableToolbarComponent } from './components/templates/table-toolbar/table-toolbar.component';
import { CadastroClienteComponent } from './pages/cliente/cadastro-cliente/cadastro-cliente.component';
import { CarrosTableComponent } from './pages/cliente/cadastro-cliente/carros-table/carros-table.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProdutoComponent } from './pages/produto/produto.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServicoComponent } from './pages/servico/servico.component';
import { ServicoTableComponent } from './pages/orcamento/cadastro-orcamento/servico-table/servico-table.component';
import { CadastroOrcamentoComponent } from './pages/orcamento/cadastro-orcamento/cadastro-orcamento.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    FornecedorComponent,
    PageHeaderComponent,
    BaseComponent,
    ConfirmDialogComponent,
    OrcamentoComponent,
    ProdutoTableComponent,
    PecasTableComponent,
    ClienteComponent,
    TableToolbarComponent,
    CadastroClienteComponent,
    CarrosTableComponent,
    ProdutoComponent,
    ServicoComponent,
    ServicoTableComponent,
    CadastroOrcamentoComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    TextMaskModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      positionClass: 'toast-top-full-width',
      closeButton: true,
    }),
    MatPaginatorModule,
    MatSelectModule,
    CurrencyMaskModule,
    MatTabsModule,
    MatCardModule,
    TextFieldModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    FullCalendarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    AppInjectorService.injector = injector;
  }
}
