const API_URL = 'https://react-fast-pizza-api.onrender.com/api';
import type { CartItemType } from '../features/cart/cartSlice';

export type MenuItemType = {
  id: number;
  name: string;
  unitPrice: number;
  imageUrl: string;
  ingredients: string[];
  soldOut: boolean;
};

export type OrderType = {
  address?: string;
  cart: Array<CartItemType>;
  createdAt?: string;
  customer: string;
  estimatedDelivery: string;
  id: string;
  orderPrice: number;
  phone?: string;
  position?: string;
  priority: boolean;
  priorityPrice: number;
  status: string;
};

export type CreateOrderType = Required<
  Pick<
    OrderType,
    'address' | 'cart' | 'customer' | 'phone' | 'position' | 'priority'
  >
>;

export async function getMenu() {
  const res = await fetch(`${API_URL}/menu`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error('Failed getting menu');

  const { data }: { data: MenuItemType[] } = await res.json();
  return data;
}

export async function getOrder(id: string) {
  const res = await fetch(`${API_URL}/order/${id}`);
  if (!res.ok) throw Error(`Couldn't find order #${id}`);

  const { data }: { data: OrderType } = await res.json();
  return data;
}

export async function createOrder(newOrder: CreateOrderType) {
  try {
    const res = await fetch(`${API_URL}/order`, {
      method: 'POST',
      body: JSON.stringify(newOrder),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw Error();
    const { data }: { data: OrderType } = await res.json();
    return data;
  } catch {
    throw Error('Failed creating your order');
  }
}

export async function updateOrder(
  id: string,
  updateObj: Pick<OrderType, 'priority'>,
) {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateObj),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw Error();
    // We don't need the data, so we don't return anything
  } catch (err) {
    throw Error('Failed updating your order');
  }
}
