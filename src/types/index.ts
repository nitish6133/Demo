export interface TableData {
  id: string;
  description: string;
  price: string;
  availability: string;
  image: string;
  category?: string;
  fullDescription?: string;
  thumbnails?: string[];
}

export interface CartItem extends TableData {
  quantity: number;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
}

export type Category = 'Gold' | 'Silver' | 'Platinum' | 'Diamond' | 'All';