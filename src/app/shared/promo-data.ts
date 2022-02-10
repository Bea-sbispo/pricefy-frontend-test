import { ECategory } from '../enumerators/ECategory';

export class PromoData {
  id: number = 0;
  gtin: number | null = null;
  categoria: string = '';
  descricao: ECategory = ECategory.BEBIDAS;
  valorRegular: number = 0;
  valorPromocional: number = 0;
  inicioPromocao: Date | null = null;
  fimPromocao: Date | null = null;
}
