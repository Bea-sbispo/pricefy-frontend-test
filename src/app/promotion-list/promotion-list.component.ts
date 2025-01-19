import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { PromoData } from '../shared/promo-data';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css'],
})
export class PromotionListComponent implements OnInit {
  promos: PromoData[] = [];
  hasEdit: boolean = false;
  formGroup!: FormGroup;

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService) {
    this.formGroup = this.fb.group(
      {
        dataInicial: [moment().format('YYYY-MM-DD')],
        dataFinal: [moment().add(3, 'days').format('YYYY-MM-DD')],
      },
      { validator: this.checkStartEndPromotion }
    );

    this.localStorageService.obsPromotions().subscribe((promos) => {
      this.promos = promos;
    });
  }

  ngOnInit(): void {
    this.promos = this.localStorageService.getPromotions();
  }

  setActive(promo_data: PromoData, hasEdit: boolean = false): void {
    this.localStorageService.setActivePromo(promo_data);
    this.hasEdit = hasEdit;
  }

  removePromo(promo_id: number): void {
    this.localStorageService.removePromo(promo_id);
  }

  dateFilter(): void {
    this.localStorageService.filterDate({
      dataInicial: this.formGroup.get('dataInicial')?.value,
      dataFinal: this.formGroup.get('dataFinal')?.value,
    });
  }

  checkStartEndPromotion(form_group: FormGroup) {
    const dataInicial = form_group.get('dataInicial')?.value;
    const dataFinal = form_group.get('dataFinal')?.value;

    return dataFinal < dataInicial ? { checkStartEndPromotion: true } : null;
  }

  endedPromo(data: Date | null): boolean {
    if (!data) return false;
    return new Date(data).setHours(0, 0, 0) < new Date().setHours(0, 0, 0);
  }

  /** Trunca o texto da descrição da promoção */
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
