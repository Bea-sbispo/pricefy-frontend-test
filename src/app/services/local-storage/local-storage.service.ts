import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { PromoData } from 'src/app/shared/promo-data';
import { IFilterPromoDTO } from './dtos/IFilterPromoDTO';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private prefix: string = 'promotions@';

  private promotions: PromoData[] = [];
  private promotions_subject: Subject<PromoData[]> = new Subject();
  private active_promo_subject: Subject<PromoData> = new Subject();

  constructor() {
    let storage_promotions = this.getItem<PromoData[]>('listOfPromotions');

    if (!storage_promotions) {
      storage_promotions = this.promotions;
      this.setItem('listOfPromotions', this.promotions);
    }

    this.promotions = storage_promotions;
    this.promotions_subject.next(this.promotions);
  }

  public obsPromotions(): Observable<PromoData[]> {
    return this.promotions_subject.asObservable();
  }

  public getPromotions(): PromoData[] {
    return this.promotions;
  }

  public savePromotion(promo_data: PromoData): boolean {
    const gtin_check = this.promotions.find(({ gtin }) => gtin === promo_data.gtin);

    if (gtin_check) return false;

    promo_data.id = Math.floor(Math.random() * 10000);
    this.promotions.push(promo_data);

    this.setItem('listOfPromotions', this.promotions);
    return true;
  }

  public updatePromotion(promo_data: PromoData): boolean {
    const id_check = this.promotions.findIndex(({ id }) => id === promo_data.id);

    if (id_check == -1) return false;

    this.promotions[id_check] = {
      ...this.promotions[id_check],
      ...promo_data,
    };

    this.setItem('listOfPromotions', this.promotions);
    this.promotions_subject.next(this.promotions);

    return true;
  }

  public removePromo(promo_id: number): void {
    const id_check = this.promotions.findIndex(({ id }) => id === promo_id);

    if (id_check == -1) return;

    this.promotions.splice(id_check, 1);

    this.setItem('listOfPromotions', this.promotions);
    this.promotions_subject.next(this.promotions);
  }

  public getActivePromo(): Observable<PromoData> {
    return this.active_promo_subject.asObservable();
  }

  public setActivePromo(promo: PromoData): void {
    return this.active_promo_subject.next(promo);
  }

  private getItem<T>(key: string): T | null {
    const item = localStorage.getItem(`${this.prefix}${key}`);

    if (!item) return null;

    return JSON.parse(item) as T;
  }

  private setItem(key: string, data: any): void {
    const serialized_data = JSON.stringify(data);
    localStorage.setItem(`${this.prefix}${key}`, serialized_data);
  }

  public filterDate({ dataInicial, dataFinal }: IFilterPromoDTO): void {
    if (!dataInicial || !dataFinal) {
      this.promotions_subject.next(this.promotions);
      return;
    }

    const filtradas = this.promotions.filter(({ inicioPromocao }) => {
      if (!inicioPromocao) return false;
      const inicioPromocaoFormat = new Date(inicioPromocao).setHours(0, 0, 0);
      const dataInicialFormat = new Date(dataInicial).setHours(0, 0, 0);
      const dataFinalFormat = new Date(dataFinal).setHours(0, 0, 0);

      return inicioPromocaoFormat >= dataInicialFormat && inicioPromocaoFormat <= dataFinalFormat;
    });

    console.log(filtradas);
    this.promotions_subject.next(filtradas);
  }
}
