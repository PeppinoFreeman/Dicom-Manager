import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteLinks } from '../../enums/route-links';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  searchText = '';

  constructor(private router: Router) {}

  searchView(): void {
    this.router
      .navigate([`${RouteLinks.View}/${this.searchText}`])
      .then(() => (this.searchText = ''));
  }
}
