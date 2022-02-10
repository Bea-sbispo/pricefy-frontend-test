import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { PromoData } from '../shared/promo-data';
import { ECategory } from '../enumerators/ECategory';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  @Input() hasEdit: boolean = false;

  @ViewChild('btnClose') btnClose!: ElementRef<HTMLButtonElement>;

  formEditGroup!: FormGroup;
  categories: string[] = Object.values(ECategory);

  constructor(private localStorageService: LocalStorageService) {
    this.localStorageService.getActivePromo().subscribe((promo) => this.createForm(promo));
  }

  ngOnInit(): void {}

  createForm(promo_data: PromoData): void {
    this.formEditGroup = new FormGroup({
      id: new FormControl(promo_data.id),
      gtin: new FormControl(promo_data.gtin),
      categoria: new FormControl(promo_data.categoria),
      descricao: new FormControl(promo_data.descricao),
      valorRegular: new FormControl(promo_data.valorRegular),
      valorPromocional: new FormControl(promo_data.valorPromocional),
      inicioPromocao: new FormControl(promo_data.inicioPromocao),
      fimPromocao: new FormControl(promo_data.fimPromocao),
    });
  }

  onSubmit() {
    if (!this.hasEdit) return;
    const updated = this.localStorageService.updatePromotion(this.formEditGroup.value);

    if (updated) {
      this.btnClose.nativeElement.click();
    }
  }
}
