import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  openedMenu = true;
  handsetMaxWidth = '(max-width: 959.99px)';
  isHandset: boolean;

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(this.handsetMaxWidth).subscribe((t) => {
      this.isHandset = t.matches;
    });
  }

  ngOnInit(): void {}

  toggleMenu() {
    this.openedMenu = !this.openedMenu;
  }
}
