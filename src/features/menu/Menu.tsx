import { useLoaderData } from 'react-router-dom';
import MenuItem from './MenuItem';
import { getMenu } from '../../services/apiRestaurant';
import type { MenuItemType } from '../../services/apiRestaurant';

function Menu() {
  const menu = useLoaderData() as MenuItemType[];
  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

//loader for react provider to get data from api'
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
