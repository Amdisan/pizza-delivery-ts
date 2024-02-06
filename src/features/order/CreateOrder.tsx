import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearCart, selectCart, selectTotalCartPrice } from '../cart/cartSlice';
import { createOrder } from '../../services/apiRestaurant';
import { store } from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { fetchAddress } from '../user/userSlice';
import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import type { CreateOrderType } from '../../services/apiRestaurant';

type ValidationError = {
  phone?: string;
};

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useAppSelector((state) => state.user);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const formErrors = useActionData() as ValidationError;
  const cart = useAppSelector(selectCart);
  const totalCartPrice = useAppSelector(selectTotalCartPrice);

  const isLoadingAddress = addressStatus === 'loading';
  const isSubmitting = navigation.state === 'submitting';

  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new">*/}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            defaultValue={username}
            required
            className="input flex-1"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="flex-1">
            <input type="tel" name="phone" required className="input" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="flex-1">
            <input
              type="text"
              name="address"
              required
              className="input"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[2.8px] top-[2.8px] z-50 md:right-[4.8px] md:top-[5px]">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority.toString()}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* passing cart as string into input */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ''
            }
          />
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? 'Placing order....'
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

//react router uses this action  with form submition
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = {
    address: formData.get('address') as string,
    cart: formData.get('cart') as string,
    customer: formData.get('customer') as string,
    phone: formData.get('phone') as string,
    position: formData.get('position') as string,
    priority: formData.get('position'),
  };

  const order: CreateOrderType = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors: ValidationError = {};

  if (!isValidPhone(order.phone)) {
    errors.phone = 'Please give us your correct phone number';
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  //if all is OK -> create new order and redirect to it's page
  const newOrder = await createOrder(order);
  //because we can use useDispatch only in components -> here we import store directly and call dispatch on it
  //do not overuse this due to lost redux optimizations because of direct store import
  store.dispatch(clearCart());
  //because we can use useNavigate only in components we need to use redirect from react router here
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
