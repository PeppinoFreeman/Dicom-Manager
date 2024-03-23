import { Component } from '@angular/core';
import { RouteLinks } from '../../enums/route-links';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly links = [
    { label: 'CREATE', url: RouteLinks.Create },
    { label: 'LIST', url: RouteLinks.List },
  ];
  collapsed = true;
}
