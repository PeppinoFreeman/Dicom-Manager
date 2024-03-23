import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, mergeMap, take } from 'rxjs';
import { ICase } from '../../interfaces/case';
import { CaseService } from '../../services/case.service';
import { FileService } from '../../services/file.service';
import { ToasterService } from '../../services/toaster.service';
import { SegmentationService } from './../../services/segmentation.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  private readonly _subject$ = new Subject<ICase>();
  isBusy = false;
  isDataLoaded = false;
  imagesContent: string[] = [];
  case: ICase;

  segmentedData: string = '';

  constructor(
    private caseService: CaseService,
    private fileService: FileService,
    private segmentService: SegmentationService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    // This is used each time we initialize the component, even if we are on the same page
    this.route.params.subscribe((param: Params) => this.getData(param['id']));
    this.case = {
      name: '',
      surname: '',
      id: '',
      sex: 0,
      birthdate: new Date(),
      dicomUrl: [],
    };
  }

  ngOnInit() {
    this._subject$.subscribe((data: ICase) => {
      this.case = data;
      this.loadDicomData(data);
      this.isDataLoaded = true;
    });
  }

  getData(id: string): void {
    this.caseService
      .getSingleCase(id || '')
      .pipe(take(1))
      .subscribe((data: ICase) => {
        this._subject$.next(data);
      });
  }

  loadDicomData(data: ICase): void {
    data.dicomUrl.forEach((url, index) => {
      this.http
        .get(url, { responseType: 'arraybuffer' })
        .pipe(
          mergeMap((response: ArrayBuffer | undefined) =>
            this.fileService.displayDicom(new DataView(response as ArrayBuffer))
          )
        )
        .subscribe((data: string) => {
          this.imagesContent[index] = data;
        });
    });
  }

  beginSegmentation(): void {
    this.isBusy = true;

    this.segmentService
      .getSegmentation(this.case.id)
      .pipe(take(1))
      .subscribe({
        next: (data: { content: string }) =>
          (this.segmentedData = data.content),
        error: (err: HttpErrorResponse) => {
          this.isBusy = false;

          const message = err.error?.message || err.message;
          this.toasterService.openToast(`ERR: ${message}`);
          console.error(err);
        },
        complete: () => (this.isBusy = false),
      });
  }
}
