import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonStyles = {
  primary: string;
  small: string;
  secondary: string;
  round: string;
};

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  type: keyof ButtonStyles;
  onClick?: (arg: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
};

function Button({ children, disabled, to, type, onClick }: ButtonProps) {
  const base =
    'text-sm inline-block bg-yellow-400 align-top font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed';
  const styles: ButtonStyles = {
    //need add space before px to work styles
    primary:
      base +
      ' rounded-md + px-4 py-2.5 md:px-6 md:py-3.5 border-2 border-yellow-400 hover:border-yellow-300 ',
    small: base + ' rounded-md + px-4 py-2 md:px-5 md:py-2.5 text-xs',
    secondary:
      'text-sm inline-block rounded-md border-2 border-stone-300 bg-transparent px-4 py-2.5 align-top font-semibold uppercase tracking-wide text-stone-400 transition-colors duration-300 hover:border-stone-300 hover:bg-stone-300 hover:text-stone-500 focus:bg-stone-300 focus:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 disabled:cursor-not-allowed md:px-6 md:py-3.5',
    round: base + ' rounded-full px-2.5 py-1 md:px-3.5 md:py-2  text-sm ',
  };

  if (to) {
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );
  }
  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
