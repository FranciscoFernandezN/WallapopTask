import type { Request, Response } from 'express';
import type { BeautifySellerDetailsRequest, BeautifySellerDetailsResponse } from '../../../shared/types/beautify.ts';
import * as beautifierService from '../services/beautifier.service.ts';

export async function beautifyListing(
  req: Request<{}, BeautifySellerDetailsResponse, BeautifySellerDetailsRequest>,
  res: Response<BeautifySellerDetailsResponse>
): Promise<void> {
  const sellerDetails = req.body;

  const beautifiedDetails = await beautifierService.beautifySellerDetails(sellerDetails.sellerDetails);

  const response: BeautifySellerDetailsResponse = {
    title: beautifiedDetails.title,
    tags: beautifiedDetails.tags,
    priceRange: beautifiedDetails.priceRange,
  };

  res.json(response);
}
