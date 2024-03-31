export type CreateProductRequest = {
  name?: string;
  description?: string;
  banner?: string;
  type?: string;
  unit?: number;
  price?: number;
  available?: boolean;
  suplier?: string;
};

export type AddToCart = {
  productId: string;
  quantity: number;
};

export type PlaceOrderRequest = {
  txnId: string;
};
