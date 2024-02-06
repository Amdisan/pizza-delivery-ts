import { useAppSelector } from '../../hooks';

function Username() {
  const username = useAppSelector((state) => state.user.username);
  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
}

export default Username;
