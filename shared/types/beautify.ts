/**
 * Request payload for the listing beautifier endpoint.
 *
 * @property sellerDetails - Raw product description text provided by the seller.
 */
export type BeautifySellerDetailsRequest = {
  sellerDetails: string;
};

/**
 * Structured response returned after beautifying a seller's listing.
 *
 * @property title - Optimized product title.
 * @property tags - Relevant search tags extracted from the description.
 * @property priceRange - Estimated price range as a tuple of [min, max].
 */
export interface BeautifySellerDetailsResponse {
  title: string;
  tags: string[];
  priceRange: [number, number];
}
