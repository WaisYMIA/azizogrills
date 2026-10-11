const Database = require('better-sqlite3');
const path = require('path');
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'azizo.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, category_group TEXT NOT NULL, cat TEXT NOT NULL, kind TEXT,
    name TEXT NOT NULL, desc TEXT, price INTEGER NOT NULL, unit TEXT NOT NULL,
    img TEXT, badges TEXT, origin TEXT, updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, customer_name TEXT,
    customer_phone TEXT NOT NULL, fulfilment TEXT NOT NULL, branch TEXT, pickup_time TEXT,
    delivery_address TEXT, delivery_lat REAL, delivery_lng REAL, delivery_fee INTEGER DEFAULT 0,
    payment_method TEXT NOT NULL, mpesa_receipt TEXT, promo_code TEXT,
    items_subtotal INTEGER NOT NULL, total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'received', created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT, name TEXT NOT NULL, qty INTEGER NOT NULL, unit TEXT,
    unit_price INTEGER NOT NULL, line_total INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS mpesa_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER REFERENCES orders(id),
    checkout_request_id TEXT, phone TEXT, amount INTEGER, status TEXT DEFAULT 'pending',
    mpesa_receipt TEXT, raw_callback TEXT, created_at TEXT DEFAULT (datetime('now'))
  );
`);

// First-run seed: the live menu as of this build, so a fresh deploy (new database,
// no products.json, no GitHub sync) still serves a real, usable catalog immediately
// instead of an empty one. Only runs when the table is empty — never overwrites
// products you've since added, edited, or deleted through the admin tool.
// Photos are simple original placeholder icons (site/images/*.svg) built for this
// project, bundled as real local files — no internet connection needed to see them.
// Swap them for real product photos any time via admin.html's uploader.
const productCount = db.prepare('SELECT COUNT(*) AS n FROM products').get().n;
if (productCount === 0) {
  const seedRows = [
    ['f1','fresh','Beef','red','Beef Rump','Lean, tender cut ideal for grilling or roasting. Cut to your preferred thickness.',650,'kg','beef-raw.svg'],
    ['f2','fresh','Beef','red','Beef Ribeye','Well-marbled steak cut, perfect for the grill.',850,'kg','beef-raw.svg'],
    ['f3','fresh','Beef','red','Beef Mince','Freshly ground beef, great for stews and burgers.',600,'kg','beef-raw.svg'],
    ['f4','fresh','Pork','red','Pork Chops','Bone-in chops, trimmed and ready to marinate.',700,'kg','pork-raw.svg'],
    ['f5','fresh','Pork','red','Pork Ribs','Full rack, ideal for slow grilling.',750,'kg','pork-raw.svg'],
    ['f6','fresh','Chicken','white','Whole Chicken','Farm-fresh, cleaned and ready to cook.',550,'bird','chicken-raw.svg'],
    ['f7','fresh','Chicken','white','Chicken Breast','Skinless, boneless fillets.',520,'kg','chicken-raw.svg'],
    ['f8','fresh','Fish','white','Tilapia (Whole)','Fresh whole tilapia, scaled and gutted on request.',450,'kg','fish-raw.svg'],
    ['f9','fresh','Fish','white','Nile Perch Fillet','Boneless fillet, ready for the pan or grill.',700,'kg','fish-raw.svg'],
    ['r1','ready','Grilled',null,'Nyama Choma (Beef)','Charcoal-grilled beef, served with kachumbari on request.',700,'kg','grilled.svg'],
    ['r2','ready','Grilled',null,'Grilled Chicken','Half or whole, marinated and grilled to order.',600,'half','grilled.svg'],
    ['r3','ready','Fried',null,'Fried Chicken','Crispy fried chicken pieces, made fresh to order.',550,'plate','fried.svg'],
    ['r4','ready','Fried',null,'Fried Fish','Deep-fried tilapia, whole or filleted.',500,'plate','fried.svg'],
    ['r5','ready','Shawarma',null,'Beef Shawarma','Wrapped shawarma with beef, salad and house sauce.',350,'wrap','shawarma.svg'],
    ['r6','ready','Shawarma',null,'Chicken Shawarma','Wrapped shawarma with chicken, salad and house sauce.',320,'wrap','shawarma.svg'],
    ['f10','fresh','Beef','red','Sirloin Steak','Tender, well-trimmed steak cut, great seared or grilled.',900,'kg','beef-raw.svg'],
    ['f11','fresh','Beef','red','T-Bone Steak','Classic bone-in steak with fillet and sirloin on either side.',950,'kg','beef-raw.svg'],
    ['f12','fresh','Beef','red','Topside Steak','Lean, economical cut — ideal for roasting or slow cooking.',750,'kg','beef-raw.svg'],
    ['f13','fresh','Beef','red','Beef Short Ribs','Flanken-style ribs, great for braising or the grill.',700,'kg','beef-raw.svg'],
    ['f14','fresh','Beef','red','Oxtail','Rich, gelatinous cut — a classic for slow-cooked stew.',800,'kg','beef-raw.svg'],
    ['f15','fresh','Beef','red','Beef Liver','Fresh beef liver, trimmed and ready to cook.',550,'kg','beef-raw.svg'],
    ['f16','fresh','Beef','red','Beef Soup Bones','Marrow bones for a rich, home-style bone broth.',250,'kg','beef-raw.svg'],
    ['f17','fresh','Chicken','white','Chicken Thighs','Juicy bone-in thighs, skin on.',600,'kg','chicken-raw.svg'],
    ['f18','fresh','Chicken','white','Chicken Drumsticks','Whole drumsticks, farm fresh.',550,'kg','chicken-raw.svg'],
    ['f19','fresh','Chicken','white','Chicken Wings','Great for grilling or deep-frying.',500,'kg','chicken-raw.svg'],
    ['f20','fresh','Chicken','white','Chicken Liver','Fresh chicken liver, cleaned and ready.',350,'kg','chicken-raw.svg'],
    ['f21','fresh','Chicken','white','Gizzard','Cleaned chicken gizzard.',400,'kg','chicken-raw.svg'],
    ['f22','fresh','Fish','white','Prawns','Fresh prawns, cleaned and deveined.',1800,'kg','fish-raw.svg'],
    ['f23','fresh','Fish','white','Salmon Fillet','Boneless imported salmon fillet.',3500,'kg','fish-raw.svg'],
    ['f24','fresh','Fish','white','Omena (Dagaa)','Sun-dried silver cyprinid, a Kenyan favourite.',400,'kg','fish-raw.svg'],
    ['f25','fresh','Goat',null,'Goat Ribs','Ribs cut for nyama choma, bone-in.',800,'kg','goat-raw.svg'],
    ['f26','fresh','Goat',null,'Goat Meat (Mbuzi)','Cubed goat meat, ready for stew or grill.',750,'kg','goat-raw.svg'],
    ['f27','fresh','Goat',null,'Mutton/Lamb Chops','Tender chops, cut to order.',950,'kg','goat-raw.svg'],
    ['g1','groceries','Vegetables',null,'Tomatoes','Fresh tomatoes — kachumbari and stew base.',120,'kg','veggies.svg'],
    ['g2','groceries','Vegetables',null,'Onions','Red onions, essential for any meat dish.',100,'kg','veggies.svg'],
    ['g3','groceries','Vegetables',null,'Dhania (Coriander)','Fresh coriander, sold by the bunch.',30,'bunch','veggies.svg'],
    ['g4','groceries','Vegetables',null,'Pilipili (Chili)','Fresh green or red chili, for kachumbari or marinades.',50,'250g','veggies.svg'],
    ['g5','groceries','Vegetables',null,'Lemon','Fresh lemons — great on grilled fish or chicken.',15,'piece','veggies.svg'],
    ['g6','groceries','Vegetables',null,'Potatoes','Fresh potatoes — chips or a stew side.',90,'kg','veggies.svg'],
    ['g7','groceries','Vegetables',null,'Kachumbari Mix','Pre-chopped tomato, onion and coriander — ready to serve.',150,'pack','veggies.svg'],
    ['g8','groceries','Spices',null,'Garlic','Fresh garlic bulbs.',200,'250g','spices.svg'],
    ['g9','groceries','Spices',null,'Ginger','Fresh ginger root.',150,'250g','spices.svg'],
    ['g10','groceries','Spices',null,'Royco / Meat Masala','All-purpose seasoning for stews and grills.',80,'packet','spices.svg'],
    ['g11','groceries','Spices',null,'Cooking Oil','Vegetable cooking oil, 1 litre.',280,'litre','spices.svg'],
    ['g12','groceries','Spices',null,'Salt','Table salt, 1kg packet.',50,'packet','spices.svg'],
  ];
  const insertSeed = db.prepare(`
    INSERT INTO products (id, category_group, cat, kind, name, desc, price, unit, img, badges, origin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '')
  `);
  const seedAll = db.transaction(() => { for (const row of seedRows) insertSeed.run(...row); });
  seedAll();
}

module.exports = db;
