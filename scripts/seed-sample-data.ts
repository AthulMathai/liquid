import { createSupabaseAdminClient } from "../src/lib/supabase/admin";

type SeedItem = {
  sku: string;
  barcode_value: string;
  item_number: string;
  title: string;
  description: string;
  condition: string;
  listed_price: number;
  min_acceptable_price: number;
  on_hand_qty: number;
  reserved_qty: number;
  status: string;
  primary_image_url?: string | null;
  has_images?: boolean;
};

type SeedOrder = {
  order_number: string;
  platform: string;
  buyer_name: string;
  payment_received: boolean;
  fulfillment_type: "pickup" | "shipping" | "delivery";
  order_status: string;
  order_date: string;
  items: Array<{
    sku: string;
    qty: number;
    shipped_qty: number;
    unit_price: number;
  }>;
};

const seedItems: SeedItem[] = [
  {
    sku: "SKU1001",
    barcode_value: "SKU1001",
    item_number: "SKU1001",
    title: "Black Toaster Oven",
    description:
      "Compact black toaster oven with multi-function heating controls.",
    condition: "good",
    listed_price: 49.99,
    min_acceptable_price: 30,
    on_hand_qty: 4,
    reserved_qty: 1,
    status: "ready",
    primary_image_url:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80",
    has_images: true,
  },
  {
    sku: "SKU1002",
    barcode_value: "SKU1002",
    item_number: "SKU1002",
    title: "Coffee Maker Stainless",
    description: "Stainless coffee maker ideal for quick local resale.",
    condition: "good",
    listed_price: 39.99,
    min_acceptable_price: 25,
    on_hand_qty: 2,
    reserved_qty: 0,
    status: "draft",
    has_images: false,
  },
  {
    sku: "SKU1003",
    barcode_value: "SKU1003",
    item_number: "SKU1003",
    title: "Portable Heater White",
    description: "Portable electric room heater in white finish.",
    condition: "used",
    listed_price: 29.99,
    min_acceptable_price: 18,
    on_hand_qty: 1,
    reserved_qty: 0,
    status: "draft",
    has_images: false,
  },
  {
    sku: "SKU1004",
    barcode_value: "SKU1004",
    item_number: "SKU1004",
    title: "Kitchen Blender Pro",
    description: "Countertop blender with glass jar and pulse control.",
    condition: "good",
    listed_price: 59.99,
    min_acceptable_price: 38,
    on_hand_qty: 3,
    reserved_qty: 0,
    status: "ready",
    has_images: false,
  },
];

const seedOrders: SeedOrder[] = [
  {
    order_number: "ORD-1001",
    platform: "facebook",
    buyer_name: "John Carter",
    payment_received: true,
    fulfillment_type: "pickup",
    order_status: "awaiting_pickup",
    order_date: new Date().toISOString(),
    items: [
      {
        sku: "SKU1001",
        qty: 1,
        shipped_qty: 0,
        unit_price: 45,
      },
    ],
  },
  {
    order_number: "ORD-1002",
    platform: "kijiji",
    buyer_name: "Maria Lopez",
    payment_received: true,
    fulfillment_type: "shipping",
    order_status: "shipped",
    order_date: new Date().toISOString(),
    items: [
      {
        sku: "SKU1002",
        qty: 1,
        shipped_qty: 1,
        unit_price: 39.99,
      },
    ],
  },
];

async function seedItemsTable() {
  const supabase = createSupabaseAdminClient();

  console.log("Seeding items...");

  const { data, error } = await supabase
    .from("items")
    .upsert(seedItems, { onConflict: "sku" })
    .select("id, sku, title, on_hand_qty, reserved_qty, status");

  if (error) {
    throw new Error(`Failed to seed items: ${error.message}`);
  }

  console.log(`Seeded ${data?.length ?? 0} item(s).`);
  return data ?? [];
}

async function seedItemImages(itemRows: Array<{ id: string; sku: string }>) {
  const supabase = createSupabaseAdminClient();

  console.log("Seeding item images...");

  const toaster = itemRows.find((item) => item.sku === "SKU1001");
  if (!toaster) {
    console.log("Skipping image seed because SKU1001 was not found.");
    return;
  }

  const images = [
    {
      item_id: toaster.id,
      storage_path: "product-images/SKU1001/image-1.jpg",
      public_url:
        "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80",
      file_name: "image-1.jpg",
      sort_order: 1,
      is_primary: true,
    },
    {
      item_id: toaster.id,
      storage_path: "product-images/SKU1001/image-2.jpg",
      public_url:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
      file_name: "image-2.jpg",
      sort_order: 2,
      is_primary: false,
    },
  ];

  const { error } = await supabase
    .from("item_images")
    .upsert(images, { onConflict: "item_id,sort_order" });

  if (error) {
    console.log(
      "Image seed skipped or partially failed. This is usually OK if unique constraints differ."
    );
    console.log(error.message);
    return;
  }

  console.log("Seeded item image metadata.");
}

async function seedOrdersTable(itemRows: Array<{ id: string; sku: string }>) {
  const supabase = createSupabaseAdminClient();

  console.log("Seeding orders...");

  for (const order of seedOrders) {
    const orderInsert = await supabase
      .from("orders")
      .upsert(
        {
          order_number: order.order_number,
          platform: order.platform,
          buyer_name: order.buyer_name,
          payment_received: order.payment_received,
          fulfillment_type: order.fulfillment_type,
          order_status: order.order_status,
          order_date: order.order_date,
        },
        { onConflict: "order_number" }
      )
      .select("id, order_number")
      .single();

    if (orderInsert.error || !orderInsert.data) {
      throw new Error(
        `Failed to seed order ${order.order_number}: ${
          orderInsert.error?.message ?? "unknown error"
        }`
      );
    }

    const orderId = orderInsert.data.id;

    for (const line of order.items) {
      const item = itemRows.find((row) => row.sku === line.sku);

      if (!item) {
        throw new Error(
          `Cannot seed order ${order.order_number}: item ${line.sku} not found.`
        );
      }

      const lineInsert = await supabase
        .from("order_items")
        .upsert(
          {
            order_id: orderId,
            item_id: item.id,
            qty: line.qty,
            shipped_qty: line.shipped_qty,
            unit_price: line.unit_price,
          },
          { onConflict: "order_id,item_id" }
        )
        .select("id")
        .single();

      if (lineInsert.error) {
        throw new Error(
          `Failed to seed order line for ${order.order_number}: ${lineInsert.error.message}`
        );
      }
    }

    console.log(`Seeded order ${order.order_number}.`);
  }
}

async function seedListings(itemRows: Array<{ id: string; sku: string }>) {
  const supabase = createSupabaseAdminClient();

  console.log("Seeding marketplace listings...");

  const listings = [
    {
      item_id: itemRows.find((item) => item.sku === "SKU1001")?.id,
      platform: "facebook",
      listing_title: "Black Toaster Oven",
      listing_price: 49.99,
      listing_url: "https://www.facebook.com/marketplace/",
      qty_listed: 1,
      listing_status: "active",
      listed_at: new Date().toISOString(),
      notes: "Starter demo listing",
    },
    {
      item_id: itemRows.find((item) => item.sku === "SKU1002")?.id,
      platform: "kijiji",
      listing_title: "Coffee Maker Stainless",
      listing_price: 39.99,
      listing_url: "https://www.kijiji.ca/",
      qty_listed: 1,
      listing_status: "draft",
      listed_at: new Date().toISOString(),
      notes: "Starter demo listing",
    },
  ].filter((listing) => Boolean(listing.item_id));

  if (!listings.length) {
    console.log("No listings to seed.");
    return;
  }

  const { error } = await supabase.from("marketplace_listings").insert(listings);

  if (error) {
    console.log("Listing seed skipped or partially failed.");
    console.log(error.message);
    return;
  }

  console.log(`Seeded ${listings.length} listing(s).`);
}

async function seedInquiries(itemRows: Array<{ id: string; sku: string }>) {
  const supabase = createSupabaseAdminClient();

  console.log("Seeding inquiries...");

  const inquiries = [
    {
      item_id: itemRows.find((item) => item.sku === "SKU1001")?.id ?? null,
      platform: "facebook",
      buyer_name: "Sarah Lee",
      buyer_email: "sarah@example.com",
      buyer_phone: "555-0001",
      message_summary: "Is this still available? Can you do $40?",
      offered_price: 40,
      inquiry_status: "negotiating",
      notes: "Interested in local pickup",
    },
    {
      item_id: itemRows.find((item) => item.sku === "SKU1002")?.id ?? null,
      platform: "kijiji",
      buyer_name: "David Kim",
      buyer_email: "david@example.com",
      buyer_phone: "555-0002",
      message_summary: "Can you ship this item?",
      offered_price: null,
      inquiry_status: "replied",
      notes: "Asked about shipping cost",
    },
  ];

  const { error } = await supabase.from("inquiries").insert(inquiries);

  if (error) {
    console.log("Inquiry seed skipped or partially failed.");
    console.log(error.message);
    return;
  }

  console.log(`Seeded ${inquiries.length} inquiry row(s).`);
}

async function main() {
  console.log("Starting sample seed...");

  const items = await seedItemsTable();

  await seedItemImages(items);
  await seedOrdersTable(items);
  await seedListings(items);
  await seedInquiries(items);

  console.log("Sample seed completed successfully.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});