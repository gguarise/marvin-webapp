import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { firstValueFrom } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Orcamento } from 'src/app/models/orcamento';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { AgendamentosDiaTableComponent } from './agendamentos-dia-table/agendamentos-dia-table.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, AfterViewInit {
  // TODO tratar como fica em mobile
  calendarOptions: CalendarOptions;
  eventos: any[] = [];
  agendamentos: Orcamento[] = [];
  clientes: Cliente[];
  showAgendamentosDia: boolean = false;
  // Caso já buscou os agendamentos para mês/ano usa os mesmos
  mesInicial: number;
  anoInicial: number;
  mesFinal: number;
  anoFinal: number;

  @ViewChild(FullCalendarComponent) calendar: FullCalendarComponent;

  constructor(
    public orcamentoService: OrcamentoService,
    public clienteService: ClienteService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.calendarOptions = {
      initialView: 'dayGridWeek',
      customButtons: {
        anterior: {
          icon: 'chevron-left',
          click: this.previous.bind(this),
        },
        proximo: {
          icon: 'chevron-right',
          click: this.next.bind(this),
        },
      },
      headerToolbar: {
        left: 'anterior,proximo today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay',
      },
      locale: ptLocale,
      eventColor: '#ef4b05',
      dateClick: this.handleDateClick.bind(this), // bind is important!
      eventClick: this.handleEventClick.bind(this),
      themeSystem: 'united',
      height: '40vw',
      weekends: true,
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
    };
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = c;
    });
  }

  ngAfterViewInit() {
    this.getEvents(this.calendar.getApi());
  }

  handleDateClick(arg: any) {
    const data = arg.date;
    this.openDialogAgendamentoDia(data);
    // Nenhum evento encontrado, cadastrar novo?
    //fechar o dialog
  }

  handleEventClick(arg: any) {
    const data = new Date(arg.event.startStr);
    data.setDate(data.getDate() + 1);
    this.openDialogAgendamentoDia(data);
  }

  openDialogAgendamentoDia(data: Date) {
    const screenSize = window.innerWidth;
    this.dialog.open(AgendamentosDiaTableComponent, {
      data,
      width: screenSize > 599 ? '70%' : '95%',
      height: 'auto',
      disableClose: false,
    });
  }

  previous(arg: any) {
    const calendarApi = this.calendar.getApi();
    calendarApi.prev();
    this.getEvents(calendarApi);
  }

  next(arg: any) {
    const calendarApi = this.calendar.getApi();
    calendarApi.next();
    this.getEvents(calendarApi);
  }

  async getEvents(calendarApi: any) {
    const range = calendarApi?.currentData?.dateProfile?.activeRange;
    if (!!range) {
      let mes = range.start?.getMonth() + 1; // Janeiro é 0
      let ano = range.start?.getFullYear();
      // Busca eventos para inicio do range
      if (mes != this.mesInicial || ano != this.anoInicial) {
        this.mesInicial = mes;
        this.anoInicial = ano;
        this.getAgendamentosPorData(false);
      }

      mes = range.end?.getMonth() + 1; // Janeiro é 0
      ano = range.end?.getFullYear();
      // Busca eventos para final do range (se diferente no inicio)
      if (
        (mes != this.mesFinal || ano != this.anoFinal) &&
        (mes != this.mesInicial || ano != this.anoInicial)
      ) {
        this.mesFinal = mes;
        this.anoFinal = ano;
        this.getAgendamentosPorData(true);
      }
    }
  }

  async getAgendamentosPorData(isFinal: boolean) {
    let mes = this.mesInicial;
    let ano = this.anoInicial;
    if (isFinal) {
      mes = this.mesFinal;
      ano = this.anoFinal;
    }

    if (!!mes && !!ano) {
      const searchParams = {
        MesAgendamento: mes,
        AnoAgendamento: ano,
      };

      await firstValueFrom(this.orcamentoService.getAll(searchParams))
        .then((x) => {
          this.agendamentos = [...this.agendamentos, ...x].filter(
            this.onlyUnique
          );
          this.transformAgendamentosToEventos();
        })
        .catch((e) => e);
    }
  }

  transformAgendamentosToEventos() {
    const calendarApi = this.calendar.getApi();
    calendarApi.removeAllEventSources();
    this.eventos = [];

    this.agendamentos.forEach((evento) => {
      this.eventos.push({
        id: evento.id,
        title: this.returnNomeCliente(evento.clienteId),
        date: evento.dataAgendamento.toString().substring(0, 10),
      });
    });
    calendarApi.addEventSource(this.eventos);
  }

  onlyUnique(value: any, index: any, self: any) {
    return self.findIndex((v: any) => v.id === value.id) === index;
  }

  returnNomeCliente(clienteId: any) {
    return this.clientes.find((x) => x.id === clienteId)?.nome;
  }
}
