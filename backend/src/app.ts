import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { env, getFrontendUrl } from './utils/env.ts';
import type { BeautifySellerDetailsRequest, BeautifySellerDetailsResponse } from '../../shared/types/beautify.ts';
import * as endpoints from './utils/api.ts';

const app: Express = express();

app.use(cors({ origin: getFrontendUrl() }));
app.use(express.json());

app.post('/v1/seller/listing-beautifier', async (req: Request<{}, BeautifySellerDetailsResponse, BeautifySellerDetailsRequest>, res: Response<BeautifySellerDetailsResponse>) => {
  const sellerDetails = req.body;

  const beautifiedDetails = await endpoints.beautifySellerDetails(sellerDetails.sellerDetails);

  const response: BeautifySellerDetailsResponse = {
    title: `Beautified: ${beautifiedDetails}`,
    tags: ['tag1', 'tag2'],
    priceRange: [10.0, 50.0],
  };

  res.json(response);
});

app.listen(env.backendPort);