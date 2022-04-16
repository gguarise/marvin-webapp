import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  constructor() {}

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [
      { title: 'event 1', date: '2022-04-27' },
      { title: 'event 2', date: '2022-04-30' },
    ],
    themeSystem: 'united',
    height: 'auto',
  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
  }
}
