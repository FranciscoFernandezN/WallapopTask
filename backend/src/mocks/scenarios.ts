/**
 * A single mock scenario that maps a keyword in the user input
 * to a valid and an invalid AI response.
 *
 * @property keyword - Substring to match against the seller's input (case-insensitive).
 * @property validResponse - A correctly formatted 3-line response that passes all validations.
 * @property invalidResponse - A malformed response that will fail parsing or word-count checks.
 */
export interface MockScenario {
    keyword: string;
    validResponse: string;
    invalidResponse: string;
}

/**
 * All mock scenarios, one per product category from the integration test suite.
 *
 * Each scenario provides a keyword that triggers it, a valid 3-line response,
 * and an invalid response used to exercise the retry logic (20% of the time).
 */
export const mockScenarios: MockScenario[] = [
    {
        keyword: 'leather jacket',
        validResponse: 'Vintage Leather Jacket Size M\nvintage, leather-jacket, size-m, brown, excellent-condition\n25-50',
        invalidResponse: 'Nice Jacket\njacket\nnot-a-price',
    },
    {
        keyword: 'iphone',
        validResponse: 'iPhone 12 Pro Max 256GB Pacific Blue\niphone-12, apple, smartphone, 256gb, unlocked\n350-500',
        invalidResponse: 'Phone\nphone\n100',
    },
    {
        keyword: 'bike',
        validResponse: 'Trek Marlin 7 Mountain Bike 29er\ntrek, mountain-bike, 29inch, hydraulic-brakes, 21-speeds\n500-700',
        invalidResponse: 'Bicycle\nbike, wheels\nfree',
    },
    {
        keyword: 'louis vuitton',
        validResponse: 'Louis Vuitton Neverfull MM Monogram\nlouis-vuitton, neverfull, designer-handbag, luxury, monogram\n900-1200',
        invalidResponse: 'Bag\nbag, nice\nexpensive',
    },
    {
        keyword: 'asus',
        validResponse: 'ASUS ROG Strix Gaming Laptop RTX 3070\nasus, rog, gaming-laptop, rtx-3070, 16gb-ram\n900-1300',
        invalidResponse: 'Laptop\ncomputer, gaming\ncheap',
    },
    {
        keyword: 'oak',
        validResponse: 'Solid Oak Dining Table Seats 6\noak, dining-table, solid-wood, rustic, seats-6\n250-400',
        invalidResponse: 'Table\nwood, table\n200',
    },
    {
        keyword: 'nike',
        validResponse: 'Nike Air Max 270 Running Shoes Size 42\nnike, air-max, running-shoes, size-42, black-white\n60-100',
        invalidResponse: 'Shoes\nnike, shoes\n50',
    },
    {
        keyword: 'canon',
        validResponse: 'Canon EOS 90D DSLR Camera with Lens\ncanon, eos-90d, dslr, camera, 18-135mm-lens\n700-900',
        invalidResponse: 'Camera\ncanon, photo\n500-600-700',
    },
    {
        keyword: 'fender',
        validResponse: 'Fender Stratocaster Electric Guitar Sunburst\nfender, stratocaster, electric-guitar, sunburst, maple-neck\n450-700',
        invalidResponse: 'Guitar\nfender, strings\nprice-on-request',
    },
    {
        keyword: 'north face',
        validResponse: 'North Face Winter Jacket Size L Black\nnorth-face, winter-jacket, size-l, black, waterproof\n120-200',
        invalidResponse: 'Jacket\nnorth-face, warm\n150',
    },
    {
        keyword: 'samsung',
        validResponse: 'Samsung Galaxy S21 Ultra 128GB Phantom Black\nsamsung, galaxy-s21-ultra, 128gb, phantom-black, smartphone\n300-450',
        invalidResponse: 'Samsung Phone\nsamsung, galaxy\n250-300-350',
    },
    {
        keyword: 'coffee',
        validResponse: "De'Longhi Magnifica Automatic Coffee Machine\ndelonghi, magnifica, coffee-machine, automatic, stainless-steel\n180-300",
        invalidResponse: 'Coffee Maker\ncoffee, machine\n200',
    },
    {
        keyword: 'yoga',
        validResponse: 'Manduka PRO Yoga Mat 6mm Black\nmanduka, yoga-mat, 6mm, black, non-slip\n70-100',
        invalidResponse: 'Exercise Mat\nyoga, fitness\n60',
    },
    {
        keyword: 'ikea',
        validResponse: 'IKEA Billy Bookshelf White 80x202cm\nikea, billy, bookshelf, white, 5-shelves\n40-70',
        invalidResponse: 'Shelf\nikea, storage\n50',
    },
    {
        keyword: 'adidas',
        validResponse: 'Adidas Ultraboost 22 Sneakers Size 43\nadidas, ultraboost-22, sneakers, size-43, core-black\n90-130',
        invalidResponse: 'Adidas Shoes\nadidas, running\n80',
    },
];
