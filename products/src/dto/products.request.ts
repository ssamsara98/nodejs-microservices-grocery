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

export type CategoryTypeParam = {
  type: string;
};

export type ProductIdParam = {
  productId: string;
};

export type ProductIdsRequest = {
  productIds: string[];
};
