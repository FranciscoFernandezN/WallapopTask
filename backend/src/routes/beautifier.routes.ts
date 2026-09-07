import { Router } from 'express';
import * as beautifierController from '../controllers/beautifier.controller.ts';

const router = Router();

/** POST /v1/seller/listing-beautifier - Beautify a seller's product listing. */
router.post('/v1/seller/listing-beautifier', beautifierController.beautifyListing);

export default router;
