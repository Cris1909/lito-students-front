import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export const GlobalButton = ({
  text,
  disabled = false,
  backgroundColor = 'primary',
  textColor = 'white',
  type = 'button',
  ...rest
}: Props) => {
  const style = disabled
    ? `bg-inactive border-inactive text-inactive-1 dark:bg-darkinactive dark:text-darkinactive-1 dark:border-darkinactive cursor-default`
    : `border-${backgroundColor} bg-${backgroundColor} text-${textColor}`;
  return (
    <button
      className={`w-full rounded-lg border p-4 transition hover:bg-opacity-90 ${style}`}
      type={disabled ? 'button' : type}
      {...rest}
    >
      {text}
    </button>
  );
};
