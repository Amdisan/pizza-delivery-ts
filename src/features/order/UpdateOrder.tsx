import { useFetcher, ActionFunctionArgs } from 'react-router-dom';
import Button from '../../ui/Button';
import { updateOrder } from '../../services/apiRestaurant';

function UpdateOrder() {
  const fetcher = useFetcher();
  return (
    //fetcher.Form - revalidates the page
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ params }: ActionFunctionArgs) {
  const data = { priority: true };
  //react router action must return something or null
  if (params.orderId) await updateOrder(params.orderId, data);
  return null;
}
