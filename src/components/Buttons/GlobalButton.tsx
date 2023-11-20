import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  icon?: any;
  classStyle?: string;
}

export const GlobalButton = ({
  text,
  disabled = false,
  backgroundColor = 'primary',
  textColor = 'white',
  type = 'button',
  classStyle,
  icon,
  ...rest
}: Props) => {
  const style = disabled
    ? `bg-inactive border-inactive text-inactive-1 dark:bg-darkinactive dark:text-darkinactive-1 dark:border-darkinactive cursor-default`
    : `border-${backgroundColor} bg-${backgroundColor} text-${textColor}`;
  return (
    <button
      disabled={disabled}
      className={`w-full justify-center rounded-lg border p-4 transition hover:bg-opacity-90 flex gap-2 items-center ${style} ${classStyle}`}
      type={disabled ? 'button' : type}
      {...rest}
    >
      {text}
      {icon}
    </button>
  );
};
