import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { ECategory } from '../enumerators/ECategory';
import * as moment from 'moment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  formNewPromo!: FormGroup;
  categories: string[] = Object.values(ECategory);

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private router: Router) {
    this.formNewPromo = this.fb.group(
      {
        gtin: [''],
        categoria: [ECategory.BEBIDAS],
        descricao: [''],
        valorRegular: [0],
        valorPromocional: [0],
        inicioPromocao: [new Date()],
        fimPromocao: [new Date()],
      },
      { validator: [this.checkStartEndPromotion, this.checkStartPromotion] }
    );
    this.formNewPromo.get('gtin')?.errors;
    this.formNewPromo.get('fimPromocao')?.errors;
  }

  ngOnInit(): void {}

  checkStartEndPromotion(form_group: FormGroup) {
    const dataInicial = form_group.get('inicioPromocao')?.value;
    const dataFinal = form_group.get('fimPromocao')?.value;

    return dataFinal < dataInicial ? { checkStartEndPromotion: true } : null;
  }

  checkStartPromotion(form_group: FormGroup) {
    const dataInicio = form_group.get('inicioPromocao')?.value;

    if (!dataInicio) return { checkStartPromotion: true };

    return moment().diff(dataInicio, 'hours') > 23 ? { checkStartPromotion: true } : null;
  }

  onSubmit() {
    if (!this.formNewPromo.valid) return;

    const saved = this.localStorageService.savePromotion(this.formNewPromo.value);

    if (saved) {
      this.router.navigate(['/']);
    }
  }
}
