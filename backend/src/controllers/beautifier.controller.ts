import type { Request, Response } from 'express';
import type { BeautifySellerDetailsRequest, BeautifySellerDetailsResponse } from '../../../shared/types/beautify.ts';
import * as beautifierService from '../services/beautifier.service.ts';
import { AppError } from '../utils/errors.ts';
import { ErrorCodes } from '../../../shared/errors/codes.ts';

/**
 * Handles POST requests to beautify a seller's listing.
 *
 * Delegates to the beautifier service and returns the structured result.
 * On failure, responds with HTTP 500 and a JSON body containing
 * an `error` message and a machine-readable `code`.
 *
 * @param req - Express request with `sellerDetails` in the body.
 * @param res - Express response typed for success and error shapes.
 */
export async function beautifyListing(
  req: Request<{}, BeautifySellerDetailsResponse, BeautifySellerDetailsRequest>,
  res: Response<BeautifySellerDetailsResponse | { error: string; code: string }>
): Promise<void> {
  const sellerDetails = req.body;

  try {
    const beautifiedDetails = await beautifierService.beautifySellerDetails(sellerDetails.sellerDetails);

    const response: BeautifySellerDetailsResponse = {
      title: beautifiedDetails.title,
      tags: beautifiedDetails.tags,
      priceRange: beautifiedDetails.priceRange,
    };

    res.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(500).json({ error: error.message, code: error.code });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred', code: ErrorCodes.INTERNAL_ERROR });
    }
  }
}
