export type BeautifySellerDetailsRequest = {
  sellerDetails: string;
};

export interface BeautifySellerDetailsResponse {
  title: string;
  tags: string[];
  priceRange: [number, number];
}
