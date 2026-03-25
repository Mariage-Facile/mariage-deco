import fs from "fs/promises";
import path from "path";

export interface Order {
  id: string;
  email: string;
  amount: number;
  currency: string;
  status: "paid" | "shipped" | "delivered" | "cancelled";
  shippingName: string;
  shippingAddress: string;
  theme: string;
  guests: number;
  tables: number;
  createdAt: string;
}

// Stockage fichier JSON pour commencer (migrer vers PostgreSQL/Supabase ensuite)
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

async function ensureDataDir() {
  const dir = path.dirname(ORDERS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await ensureDataDir();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
}

export async function getOrders(): Promise<Order[]> {
  return readOrders();
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((o) => o.id === id);
}
