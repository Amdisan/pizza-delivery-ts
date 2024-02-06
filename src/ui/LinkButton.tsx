import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type LinkButtonProps = {
  children: ReactNode;
  to: string;
};

function LinkButton({ children, to }: LinkButtonProps) {
  const className = 'text-sm text-blue-500 hover:text-blue-600 hover:underline';
  const navigate = useNavigate();
  if (to === '-1') {
    return (
      <button className={className} onClick={() => navigate(-1)}>
        {children}
      </button>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default LinkButton;
