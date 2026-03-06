const dataset = [
  // GIFTS
  { age:"19-25", gender:"male",   country:"IN", region:"north",   preference:"tech gadgets",       price:"1000-3000",  buy:"online",   occasion:"birthday",    recommendation:"Wireless Earbuds" },
  { age:"19-25", gender:"female", country:"IN", region:"south",   preference:"personalized gifts", price:"under-1000", buy:"online",   occasion:"anniversary", recommendation:"Custom Photo Frame" },
  { age:"26-40", gender:"male",   country:"US", region:"east",    preference:"luxury items",       price:"above-5000", buy:"in-store", occasion:"wedding",     recommendation:"Premium Watch" },
  { age:"26-40", gender:"female", country:"UK", region:"central", preference:"handmade items",     price:"1000-3000",  buy:"in-store", occasion:"festival",    recommendation:"Artisan Jewelry Set" },
  { age:"8-18",  gender:"male",   country:"IN", region:"west",    preference:"tech gadgets",       price:"under-1000", buy:"online",   occasion:"birthday",    recommendation:"Gaming Headset" },
  { age:"8-18",  gender:"female", country:"IN", region:"east",    preference:"personalized gifts", price:"under-1000", buy:"online",   occasion:"birthday",    recommendation:"Personalized Diary" },
  { age:"40+",   gender:"female", country:"IN", region:"south",   preference:"luxury items",       price:"above-5000", buy:"in-store", occasion:"anniversary", recommendation:"Silk Saree Set" },
  { age:"40+",   gender:"male",   country:"US", region:"west",    preference:"budget-friendly gifts",price:"under-1000",buy:"online",  occasion:"festival",    recommendation:"Aromatic Candle Set" },
  { age:"19-25", gender:"other",  country:"CA", region:"north",   preference:"tech gadgets",       price:"3000-5000",  buy:"online",   occasion:"birthday",    recommendation:"Portable Bluetooth Speaker" },
  { age:"26-40", gender:"male",   country:"IN", region:"north",   preference:"tech gadgets",       price:"3000-5000",  buy:"online",   occasion:"wedding",     recommendation:"Smart Home Device" },
  { age:"19-25", gender:"female", country:"IN", region:"west",    preference:"budget-friendly gifts",price:"under-1000",buy:"online",  occasion:"birthday",    recommendation:"Skincare Gift Set" },
  { age:"26-40", gender:"female", country:"IN", region:"east",    preference:"personalized gifts", price:"1000-3000",  buy:"online",   occasion:"anniversary", recommendation:"Customized Couple Portrait" },
  { age:"8-18",  gender:"male",   country:"IN", region:"central", preference:"tech gadgets",       price:"1000-3000",  buy:"online",   occasion:"festival",    recommendation:"Smartwatch" },
  { age:"40+",   gender:"male",   country:"IN", region:"west",    preference:"luxury items",       price:"above-5000", buy:"in-store", occasion:"anniversary", recommendation:"Gold Cufflinks" },
  { age:"19-25", gender:"male",   country:"UK", region:"south",   preference:"handmade items",     price:"1000-3000",  buy:"in-store", occasion:"birthday",    recommendation:"Handmade Leather Wallet" },

  // CLOTHES
  { age:"19-25", gender:"female", country:"IN", region:"north",   preference:"casual",     price:"under-1000", buy:"online",   occasion:"daily",    recommendation:"Trendy Crop Top & Jeans Combo" },
  { age:"19-25", gender:"male",   country:"IN", region:"west",    preference:"streetwear", price:"1000-3000",  buy:"online",   occasion:"casual",   recommendation:"Oversized Graphic Hoodie" },
  { age:"26-40", gender:"male",   country:"US", region:"east",    preference:"formal",     price:"3000-5000",  buy:"in-store", occasion:"work",     recommendation:"Slim Fit Suit" },
  { age:"26-40", gender:"female", country:"IN", region:"south",   preference:"traditional",price:"1000-3000",  buy:"in-store", occasion:"festival", recommendation:"Anarkali Kurta Set" },
  { age:"8-18",  gender:"male",   country:"IN", region:"east",    preference:"sportswear", price:"under-1000", buy:"online",   occasion:"sports",   recommendation:"Dry-fit Jersey Set" },
  { age:"40+",   gender:"female", country:"UK", region:"central", preference:"formal",     price:"above-5000", buy:"in-store", occasion:"work",     recommendation:"Premium Blazer" },

  // FOOD
  { age:"19-25", gender:"male",   country:"IN", region:"north",   preference:"spicy",   price:"under-1000", buy:"online",   occasion:"daily",  recommendation:"Spicy Noodle Box Subscription" },
  { age:"26-40", gender:"female", country:"US", region:"west",    preference:"healthy", price:"1000-3000",  buy:"online",   occasion:"weekly", recommendation:"Organic Meal Kit" },
  { age:"8-18",  gender:"male",   country:"IN", region:"south",   preference:"sweet",   price:"under-1000", buy:"in-store", occasion:"rarely", recommendation:"Chocolate Dessert Box" },
  { age:"40+",   gender:"female", country:"IN", region:"east",    preference:"savory",  price:"under-1000", buy:"in-store", occasion:"daily",  recommendation:"Traditional Pickle & Papad Set" },
  { age:"19-25", gender:"female", country:"IN", region:"west",    preference:"healthy", price:"1000-3000",  buy:"online",   occasion:"daily",  recommendation:"Protein Smoothie Pack" },
  { age:"26-40", gender:"male",   country:"AU", region:"east",    preference:"savory",  price:"1000-3000",  buy:"online",   occasion:"weekly", recommendation:"BBQ Meal Kit Subscription" },
  { age:"8-18",  gender:"female", country:"IN", region:"north",   preference:"sweet",   price:"under-1000", buy:"in-store", occasion:"rarely", recommendation:"Candy & Snack Gift Box" },

  // SERVICES
  { age:"19-25", gender:"male",   country:"IN", region:"north",   preference:"online courses",  price:"1000-3000",  buy:"online",   occasion:"self-improvement", recommendation:"Full Stack Development Course" },
  { age:"26-40", gender:"female", country:"US", region:"east",    preference:"gym",             price:"3000-5000",  buy:"in-store", occasion:"fitness",          recommendation:"Premium Gym Membership" },
  { age:"19-25", gender:"female", country:"IN", region:"south",   preference:"beauty services", price:"under-1000", buy:"online",   occasion:"grooming",         recommendation:"Monthly Beauty Box Subscription" },
  { age:"40+",   gender:"male",   country:"IN", region:"west",    preference:"consulting",      price:"above-5000", buy:"online",   occasion:"business",         recommendation:"Business Strategy Consultant" },
  { age:"8-18",  gender:"other",  country:"IN", region:"central", preference:"online courses",  price:"under-1000", buy:"online",   occasion:"education",        recommendation:"Creative Coding for Kids" },
  { age:"26-40", gender:"male",   country:"UK", region:"north",   preference:"gym",             price:"1000-3000",  buy:"online",   occasion:"fitness",          recommendation:"Home Workout Program" },
  { age:"40+",   gender:"female", country:"IN", region:"south",   preference:"beauty services", price:"1000-3000",  buy:"in-store", occasion:"grooming",         recommendation:"Premium Spa Package" },
  { age:"19-25", gender:"male",   country:"AU", region:"west",    preference:"repair services", price:"under-1000", buy:"online",   occasion:"home",             recommendation:"On-Demand Tech Repair Service" },
  { age:"26-40", gender:"female", country:"IN", region:"north",   preference:"online courses",  price:"1000-3000",  buy:"online",   occasion:"career",           recommendation:"Digital Marketing Masterclass" },
  { age:"19-25", gender:"female", country:"CA", region:"east",    preference:"gym",             price:"1000-3000",  buy:"in-store", occasion:"fitness",          recommendation:"Yoga & Pilates Studio Pass" },
  { age:"40+",   gender:"male",   country:"US", region:"central", preference:"consulting",      price:"3000-5000",  buy:"online",   occasion:"business",         recommendation:"Financial Planning Consultation" }
];
