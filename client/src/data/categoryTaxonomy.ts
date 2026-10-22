export interface TaxonomyItem {
  name: string;
  query: string; // value used for search or type filter
  badge?: string;
}

export interface CategoryTaxonomy {
  id: string;
  title: string;
  href: string;
  subtitle: string;
  products: TaxonomyItem[];
}

export const CATEGORY_TAXONOMY: Record<string, CategoryTaxonomy> = {
  mens: {
    id: 'mens',
    title: 'Mens',
    href: '/shop?category=Mens',
    subtitle: 'Heavyweight organic cotton, relaxed tailoring & enduring forest staples',
    products: [
      { name: 'T-shirts (Crew neck, V-neck, Polo)', query: 't-shirt' },
      { name: 'Shirts (Button-down, Hawaiian, Henley, Rugby)', query: 'shirt' },
      { name: 'Hoodies & Sweatshirts', query: 'hoodie', badge: 'Hot' },
      { name: 'Sweaters, Cardigans, Tank tops', query: 'sweater' },
      { name: 'Jeans, Chinos, Khakis', query: 'chinos' },
      { name: 'Cargo pants, Joggers, Track pants', query: 'cargo', badge: 'Trending' },
      { name: 'Shorts (Bermuda, Athletic, Denim)', query: 'shorts' },
      { name: 'Jackets (Bomber, Denim, Varsity, Leather, Puffer)', query: 'jacket' },
      { name: 'Coats (Trench, Pea coat, Parka)', query: 'coat' },
      { name: 'Suits, Tuxedos, Overalls', query: 'suit' },
      { name: 'Sneakers, Boots, Sandals', query: 'footwear' },
      { name: 'Accessories (Hats, Belts, Bags, Socks)', query: 'accessories' },
      { name: 'Innerwear (Briefs, Boxers, Undershirts, Socks)', query: 'innerwear' },
    ],
  },

  womens: {
    id: 'womens',
    title: 'Womens',
    href: '/shop?category=Womens',
    subtitle: 'Airy linen smocks, organic botanical dyes & minimalist silhouettes',
    products: [
      { name: 'Blouses, Crop tops & Camisoles', query: 'blouse' },
      { name: 'Bodysuits, Sweaters & Tunics', query: 'sweater' },
      { name: 'Jeans, Leggings & Trousers', query: 'trousers' },
      { name: 'Capris & Culottes', query: 'culottes' },
      { name: 'Skirts (A-line, Pencil, Mini, Denim, Peplum, Sarong)', query: 'skirt', badge: 'Popular' },
      { name: 'Dresses (Maxi, Midi, Mini, Sheath, Shift, Halter)', query: 'dress', badge: 'Staple' },
      { name: 'Summer dresses, Ball gowns & Wedding dresses', query: 'summer dress' },
      { name: 'Blazers, Trench coats, Shawls, Ponchos', query: 'blazer' },
      { name: 'Puffer jackets & Cold-weather layers', query: 'jacket' },
      { name: 'Jumpsuits, Rompers & Overalls', query: 'jumpsuit' },
      { name: 'Footwear (Sandals, Boots, Slippers)', query: 'footwear' },
      { name: 'Accessories (Jewelry, Scarves, Handbags, Hats)', query: 'accessories' },
      { name: 'Intimates (Lingerie, Bras, Panties, Shapewear)', query: 'intimates' },
    ],
  },

  kids: {
    id: 'kids',
    title: 'Kids',
    href: '/shop?category=Kids',
    subtitle: 'Hypoallergenic organic cotton crafted for young forest explorers',
    products: [
      { name: 'T-shirts, Shirts & Polos', query: 't-shirt' },
      { name: 'Sweaters & Hoodies', query: 'hoodie', badge: 'Cozy' },
      { name: 'Shorts & Athletic Bottoms', query: 'shorts' },
      { name: 'Jeans, Joggers & Leggings', query: 'joggers' },
      { name: 'Sundresses, Frocks & Skirts', query: 'dress' },
      { name: 'Jackets, Raincoats & Sweaters', query: 'jacket' },
      { name: 'Overalls & Rompers', query: 'romper' },
      { name: 'Sneakers, Sandals & School shoes', query: 'school shoes' },
      { name: 'School Uniforms (Cotton shirts & trousers)', query: 'uniform', badge: 'India Essential' },
      { name: 'Accessories (Caps, Socks, Backpacks)', query: 'backpack' },
      { name: 'Intimates (Underwear, Vests, Socks)', query: 'innerwear' },
    ],
  },

  genz: {
    id: 'genz',
    title: 'GenZ',
    href: '/shop?category=GenZ',
    subtitle: 'Streetwear, baggy boxy cuts, Y2K aesthetic & gender-fluid silhouettes',
    products: [
      { name: 'Oversized Hoodies & Sweatshirts', query: 'oversized hoodie', badge: 'Top Pick' },
      { name: 'Graphic Tees & Heavyweight Jerseys', query: 'graphic tee' },
      { name: 'Baggy Jeans & Raw Denim', query: 'baggy jeans' },
      { name: 'Cargo Pants & Bucket Hats', query: 'cargo pants' },
      { name: 'Track Pants, Leggings & Zip Jackets (Athleisure)', query: 'track pants' },
      { name: 'Washed Denim, Patterned Shirts & Track Jackets', query: 'washed denim' },
      { name: 'Old-School Knits & Cardigans (Retro Revival)', query: 'vintage knit' },
      { name: 'Baby Tees, Low-Rise Pants & Metallic Pieces (Y2K)', query: 'y2k' },
      { name: 'Boxy Shirts, Relaxed Tailoring & Fluid Knits (Gender-fluid)', query: 'gender-fluid', badge: 'Trending' },
      { name: 'Shell Jackets, Nylon Pants & Modular Layers (Techwear)', query: 'techwear', badge: 'New' },
      { name: 'Thrifted Denim & Recycled Fabrics (Sustainable)', query: 'sustainable' },
      { name: 'Embroidered Items, Patches & Custom Prints (DIY)', query: 'embroidery' },
    ],
  },
};
