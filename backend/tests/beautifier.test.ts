import {describe, expect, test} from '@jest/globals';
import {beautifySellerDetails} from '../src/utils/api.ts';

async function assertBeautified(
  input: string,
  titleShouldContain: string[],
  titleShouldNotContain: string[],
  acceptableTags: string[],
  expectedPriceRange: [number, number],
) {
  const result = await beautifySellerDetails(input);

  const titleLower = result.title.toLowerCase();

  const matchingKeywords = titleShouldContain.filter(keyword =>
    titleLower.includes(keyword.toLowerCase())
  );
  expect(matchingKeywords.length).toBeGreaterThanOrEqual(titleShouldContain.length / 2);

  const matchingExclusions = titleShouldNotContain.filter(keyword =>
    titleLower.includes(keyword.toLowerCase())
  );
  expect(matchingExclusions.length).toBeLessThanOrEqual(titleShouldNotContain.length / 2);

  const resultTagsLower = result.tags.map(tag => tag.toLowerCase());
  const acceptableTagsLower = acceptableTags.map(tag => tag.toLowerCase());

  const matchingTags = resultTagsLower.filter(tag =>
    acceptableTagsLower.some(acceptable => acceptable === tag || acceptable.includes(tag) || tag.includes(acceptable))
  );

  const matchPercentage = (matchingTags.length / resultTagsLower.length) * 100;
  expect(matchPercentage).toBeGreaterThanOrEqual(50);

  const [resultMin, resultMax] = result.priceRange;
  const [expectedMin, expectedMax] = expectedPriceRange;

  expect(resultMin).toBeGreaterThanOrEqual(expectedMin * 0.7);
  expect(resultMax).toBeLessThanOrEqual(expectedMax * 1.3);
  expect(resultMin).toBeLessThan(resultMax);
}

describe('Listing Beautifier', () => {
  test('Vintage leather jacket', async () => {
    await assertBeautified(
      'Vintage leather jacket, worn once, size M, brown color, excellent condition',
      ['jacket', 'leather'],
      ['worn', 'color', 'excellent'],
      ['vintage', 'leather-jacket', 'size-m', 'brown', 'jacket', 'outerwear', 'clothing', 'retro', 'like-new', 'men'],
      [20, 80],
    );
  }, 30000);

  test('iPhone 12 Pro Max', async () => {
    await assertBeautified(
      'iPhone 12 Pro Max 256GB, Pacific Blue, unlocked, includes original box and charger, minor scratches',
      ['iphone', '12'],
      ['charger', 'scratches', 'includes'],
      ['iphone-12', 'apple', 'smartphone', '256gb', 'phone', 'mobile', 'ios', 'tech', 'electronics', 'pro-max'],
      [300, 600],
    );
  }, 30000);

  test('Mountain bike Trek Marlin 7', async () => {
    await assertBeautified(
      'Mountain bike Trek Marlin 7, 29 inch wheels, hydraulic disc brakes, 21 speeds, barely used',
      ['bike', 'trek'],
      ['wheels', 'brakes', 'speeds', 'barely'],
      ['mountain-bike', 'trek', 'bicycle', 'cycling', 'sports', '29inch', 'outdoor', 'fitness', 'marlin', 'bike'],
      [400, 800],
    );
  }, 30000);

  test('Louis Vuitton Neverfull MM handbag', async () => {
    await assertBeautified(
      'Louis Vuitton Neverfull MM handbag, monogram canvas, authentic with receipt, used but good condition',
      ['louis', 'vuitton', 'handbag'],
      ['receipt', 'authentic', 'canvas', 'monogram'],
      ['louis-vuitton', 'designer', 'handbag', 'luxury', 'bag', 'neverfull', 'fashion', 'accessories', 'women', 'monogram'],
      [800, 1500],
    );
  }, 30000);

  test('Gaming laptop ASUS ROG Strix', async () => {
    await assertBeautified(
      'Gaming laptop ASUS ROG Strix, RTX 3070, 16GB RAM, 1TB SSD, 144Hz screen, perfect for gaming',
      ['laptop', 'asus', 'gaming'],
      ['perfect', 'screen', 'ram', 'ssd'],
      ['gaming-laptop', 'asus', 'rog', 'rtx-3070', 'laptop', 'computer', 'gaming', 'tech', 'electronics', 'pc'],
      [800, 1500],
    );
  }, 30000);

  test('Solid oak dining table', async () => {
    await assertBeautified(
      'Solid oak dining table, seats 6 people, rustic style, some wear marks but very sturdy, dimensions 180x90cm',
      ['table', 'oak', 'dining'],
      ['seats', 'dimensions', 'sturdy', 'wear'],
      ['dining-table', 'oak', 'furniture', 'table', 'rustic', 'wood', 'home', 'kitchen', 'solid-wood', 'seating'],
      [200, 500],
    );
  }, 30000);

  test('Nike Air Max 270 running shoes', async () => {
    await assertBeautified(
      'Nike Air Max 270 running shoes, size 42, black and white, worn few times, great condition',
      ['nike', 'shoes', 'air'],
      ['worn', 'times', 'great'],
      ['nike', 'air-max', 'running-shoes', 'sneakers', 'size-42', 'footwear', 'sports', 'athletic', 'shoes', 'nike-air'],
      [50, 120],
    );
  }, 30000);

  test('Canon EOS 90D DSLR camera', async () => {
    await assertBeautified(
      'Canon EOS 90D DSLR camera with 18-135mm lens, includes camera bag and 32GB memory card, excellent for photography',
      ['canon', 'camera', 'dslr'],
      ['lens', 'bag', 'card', 'excellent', 'photography'],
      ['canon', 'dslr', 'camera', 'eos-90d', 'photography', 'photo', 'lens', 'electronics', 'canon-camera', 'digital-camera'],
      [600, 1000],
    );
  }, 30000);

  test('Fender Stratocaster electric guitar', async () => {
    await assertBeautified(
      'Fender Stratocaster electric guitar, sunburst finish, maple neck, includes gig bag, plays great',
      ['fender', 'guitar', 'stratocaster'],
      ['finish', 'neck', 'bag', 'plays'],
      ['fender', 'electric-guitar', 'stratocaster', 'guitar', 'music', 'instrument', 'sunburst', 'musical', 'fender-guitar', 'strings'],
      [400, 800],
    );
  }, 30000);

  test('North Face winter jacket', async () => {
    await assertBeautified(
      'North Face winter jacket, size L, black, waterproof, thermal insulation, barely worn this season',
      ['jacket', 'north', 'face', 'winter'],
      ['waterproof', 'thermal', 'insulation', 'barely', 'season'],
      ['north-face', 'winter-jacket', 'jacket', 'outerwear', 'black', 'size-l', 'thermal', 'waterproof', 'clothing', 'coat'],
      [100, 250],
    );
  }, 30000);

  test('Samsung Galaxy S21 Ultra', async () => {
    await assertBeautified(
      'Samsung Galaxy S21 Ultra 128GB, Phantom Black, excellent condition with screen protector, includes case',
      ['samsung', 'galaxy', 's21'],
      ['protector', 'case', 'includes', 'phantom'],
      ['samsung', 'galaxy-s21', 'smartphone', 'android', 'phone', 'mobile', '128gb', 's21-ultra', 'electronics', 'tech'],
      [250, 500],
    );
  }, 30000);

  test('De\'Longhi Magnifica coffee machine', async () => {
    await assertBeautified(
      'De\'Longhi Magnifica coffee machine, automatic espresso, stainless steel, works perfectly, descaled regularly',
      ['coffee', 'machine', 'delonghi'],
      ['espresso', 'stainless', 'perfectly', 'descaled'],
      ['coffee-machine', 'delonghi', 'espresso', 'kitchen', 'appliance', 'coffee', 'automatic', 'home', 'kitchen-appliance', 'cappuccino'],
      [150, 350],
    );
  }, 30000);

  test('Manduka PRO yoga mat', async () => {
    await assertBeautified(
      'Manduka PRO yoga mat, 6mm thick, black color, non-slip surface, used for home practice only',
      ['yoga', 'mat', 'manduka'],
      ['thick', 'surface', 'practice', 'non-slip'],
      ['yoga-mat', 'manduka', 'yoga', 'fitness', 'exercise', 'mat', 'home-fitness', 'wellness', 'sports', 'pilates'],
      [60, 120],
    );
  }, 30000);

  test('IKEA Billy bookshelf', async () => {
    await assertBeautified(
      'IKEA Billy bookshelf, white, 80x202cm, 5 shelves, assembled but can be disassembled, minor scratches on side',
      ['bookshelf', 'ikea', 'billy'],
      ['assembled', 'disassembled', 'scratches', 'shelves'],
      ['ikea', 'bookshelf', 'billy', 'furniture', 'storage', 'white', 'shelf', 'home', 'bookcase', 'organization'],
      [30, 80],
    );
  }, 30000);

  test('Adidas Ultraboost 22 sneakers', async () => {
    await assertBeautified(
      'Adidas Ultraboost 22 sneakers, size 43, core black, Boost technology, very comfortable, lightly used',
      ['adidas', 'sneakers', 'ultraboost'],
      ['technology', 'comfortable', 'lightly', 'core'],
      ['adidas', 'ultraboost', 'sneakers', 'running-shoes', 'size-43', 'footwear', 'athletic', 'sports', 'shoes', 'adidas-shoes'],
      [80, 150],
    );
  }, 30000);
});
