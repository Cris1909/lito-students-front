import React, { ReactNode } from 'react';
import {
  Control,
  FieldError,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegister<any>;
  name: string;
  icon: ReactNode;
  rules?: RegisterOptions<FieldValues>;
  error?: FieldError;
}

export const CustomInput: React.FC<Props> = ({
  label,
  icon,
  register,
  name,
  rules,
  error,
  ...rest
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative grid items-center">
        <input
          className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border ${
            error ? 'border-danger text-danger' : null
          }`}
          {...register(name, rules)}
          {...rest}
        />
        <span
          className={`absolute right-4 opacity-50 text-body`}
        >
          {icon}
        </span>
      </div>
      {error ? <p className="text-danger text-sm">{error.message}</p> : null}
    </div>
  );
};
