import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { RouteLinks } from '../../enums/route-links';
import { ICase } from '../../interfaces/case';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  readonly list$ = new BehaviorSubject<ICase[]>([]);
  isListLoaded = false;

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit(): void {
    this.caseService
      .getAllCases()
      .pipe(take(1))
      .subscribe((data: ICase[]) => {
        this.list$.next(data);
        this.isListLoaded = true;
      });
  }

  navigateToView(url: string): void {
    this.router.navigate([`${RouteLinks.View}/${url}`]);
  }
}
