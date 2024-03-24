import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { RouteLinks } from '../../enums/route-links';
import { ICase } from '../../interfaces/case';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, AfterViewInit {
  isListLoaded = false;
  caseListDataSource = new MatTableDataSource<ICase>([]);
  private _originalCaseList: ICase[] = [];
  displayedColumns: string[] = ['name', 'surname', 'birthdate', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit(): void {
    this.caseService
      .getAllCases()
      .pipe(take(1))
      .subscribe((data: ICase[]) => {
        this.isListLoaded = true;
        this.caseListDataSource.data = data;
        this._originalCaseList = [...data];
      });
  }

  ngAfterViewInit() {
    this.caseListDataSource.paginator = this.paginator;
    this.caseListDataSource.sort = this.sort;
  }

  navigateToView(url: string): void {
    this.router.navigate([`${RouteLinks.View}/${url}`]);
  }

  deleteCase(event: MouseEvent, element: ICase): void {
    event.stopPropagation();
    event.preventDefault();

    console.log(element);
  }

  editCase(event: MouseEvent, element: ICase): void {
    event.stopPropagation();
    event.preventDefault();

    console.log(element);
  }

  sortData(event: Sort): void {
    this.caseListDataSource.data =
      event.direction == ''
        ? [...this._originalCaseList]
        : this.caseListDataSource.data.sort((a: any, b: any) => {
            let val1 = a[event.active];
            let val2 = b[event.active];

            if (event.active == 'birthdate') {
              val1 = new Date(val1);
              val2 = new Date(val2);
            } else {
              val1 = val1.toLowerCase();
              val2 = val2.toLowerCase();
            }

            switch (event.direction) {
              case 'asc':
                return val1 > val2 ? 1 : -1;
              case 'desc':
                return val1 > val2 ? -1 : 1;
              default:
                return 0;
            }
          });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.caseListDataSource.filter = filterValue.trim().toLowerCase();
    this.caseListDataSource.paginator?.firstPage();
  }
}
