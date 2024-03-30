import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { RouteLinks } from '../../enums/route-links';
import { ICase } from '../../interfaces/case';
import { IImage } from '../../interfaces/image';
import { IPatient, Sex } from '../../interfaces/patient';
import { CaseService } from '../../services/case.service';
import { FileService } from '../../services/file.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  isDragOver = false;
  isBusy = false;
  images: IImage[];
  imagesToDisplay: IImage[] = [];
  readonly sex = Sex;

  // Used in case of edition mode (if we came from the edit button)
  readonly editData: ICase;
  private _editMode: boolean = false;

  // Used for form validation
  createCaseForm: FormGroup;
  readonly formControls = {
    patientName: 'patientName',
    patientSurname: 'patientSurname',
    patientBirthdate: 'patientBirthdate',
    patientSex: 'patientSex',
  };

  constructor(
    private caseService: CaseService,
    private fileService: FileService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private router: Router
  ) {
    this.images = [];

    this.editData = this.router.getCurrentNavigation()?.extras.state?.['data'];
    this._editMode = !!this.editData;

    this.createCaseForm = this.formBuilder.group({
      [this.formControls.patientName]: new FormControl(
        this.editData?.name || '',
        {
          validators: Validators.compose([Validators.required]),
        }
      ),
      [this.formControls.patientBirthdate]: new FormControl(
        new Date(this.editData?.birthdate),
        {
          validators: Validators.compose([Validators.required]),
        }
      ),
      [this.formControls.patientSurname]: new FormControl(
        this.editData?.surname || '',
        {
          validators: Validators.compose([Validators.required]),
        }
      ),
      [this.formControls.patientSex]: new FormControl(
        this.editData?.sex ?? '',
        {
          validators: Validators.compose([Validators.required]),
        }
      ),
    });
  }

  async addFiles(event: any): Promise<void> {
    this.isDragOver = false;

    const files: File[] = event.target?.files || event.dataTransfer?.files;
    if (!files) {
      return; // TODO add error (with a toast?)
    }

    this.fileService
      .uploadFiles(files, this.images, this.imagesToDisplay)
      .pipe(take(1))
      .subscribe((data) => ([this.images, this.imagesToDisplay] = data));
  }

  save(): void {
    const get = (test: string) => this.createCaseForm.get(test)?.value;
    const patient: IPatient = {
      name: get(this.formControls.patientName).trim(),
      surname: get(this.formControls.patientSurname).trim(),
      birthdate: get(this.formControls.patientBirthdate).toISOString(),
      sex: get(this.formControls.patientSex),
    };

    this._editMode ? this.update(patient) : this.create(patient);
  }

  private create(patient: IPatient): void {
    this.caseService
      .createCase(patient, this.images)
      .pipe(take(1))
      .subscribe({
        next: (id: string) =>
          this.router.navigate([`${RouteLinks.View}/${id}`]),
        error: (err: HttpErrorResponse) => {
          this.isBusy = false;

          const message = err.error?.message || err.message;
          this.toasterService.openToast(`ERR: ${message}`);
          console.error(err);
        },
        complete: () => (this.isBusy = false),
      });
  }

  private update(patient: IPatient): void {
    const id = this.editData.id;
    console.log('test');

    this.caseService
      .editCase(patient, this.images, id)
      .pipe(take(1))
      .subscribe({
        next: (id: string) =>
          this.router.navigate([`${RouteLinks.View}/${id}`]),
        error: (err: HttpErrorResponse) => {
          this.isBusy = false;

          const message = err.error?.message || err.message;
          this.toasterService.openToast(`ERR: ${message}`);
          console.error(err);
        },
        complete: () => (this.isBusy = false),
      });
  }

  removeImage(image: IImage): void {
    this.imagesToDisplay = this.imagesToDisplay.filter(
      (i) => i.name != image.name
    );
    this.images = this.images.filter((i) => i.name != image.name);
  }

  onDragOver(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.isDragOver = true;
  }
}
