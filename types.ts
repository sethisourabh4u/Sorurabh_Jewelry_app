
export type GoldColour = 'Yellow' | 'Rose' | 'White' | 'Yellow-White' | 'Rose-White' | 'Yellow-Rose';

export interface OrderDetails {
  party: string;
  orderTo: string;
  design: string;
  factoryDesignNo: string;
  goldWt: string;
  goldKt: '9' | '14' | '18' | '20' | '22';
  goldColour: GoldColour;
  diaWt: string;
  diaQuality: string;
  diaPrice: string;
  goldPrice: string;
  size: string;
  orderDate: string;
  deliveryDate: string;
  comments: string;
  images: string[];
}

export interface UserDetails {
  name: string;
  company: string;
  mobile: string;
}
