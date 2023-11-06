import { Link } from 'react-router-dom';
import {
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';

import { ROUTES } from '../../../enums';
import { CustomInput } from '../../../components';
import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { PatterRegex } from '../../../constants';

const iconStyle = { width: 25, height: 25 };
interface IFormInput {
  email: string;
  password: string;
}

const emailValidations: RegisterOptions<FieldValues> = {
  required: {
    value: true,
    message: 'El email es requerido',
  },
  pattern: {
    value: PatterRegex.emailRegex,
    message: 'Email invalido',
  },
};

const passwordValidations: RegisterOptions<FieldValues> = {
  required: {
    value: true,
    message: 'La contraseña es requerida',
  },
  pattern: {
    value: PatterRegex.passwordRegex,
    message: 'Debe tener al menos una letra, un número y un carácter especial',
  },
};

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>();

  const PasswordIcon = showPassword ? BsEye : BsEyeSlash;
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const passwordInputType = showPassword ? 'text' : 'password';

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <div className="h-screen">
      <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Inicia sesión
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          control={control}
          register={register}
          name="email"
          label="Correo"
          icon={<MdOutlineMailOutline style={iconStyle} />}
          type="email"
          rules={emailValidations}
          placeholder={'Correo'}
          autoComplete="email"
          error={errors.email}
        />

        <CustomInput
          control={control}
          register={register}
          name="password"
          label="Contraseña"
          icon={
            <PasswordIcon
              style={iconStyle}
              onClick={toggleShowPassword}
              className="cursor-pointer"
            />
          }
          placeholder="Ingresa tu contraseña"
          type={passwordInputType}
          autoComplete="current-password"
          rules={passwordValidations}
          error={errors.password}
        />

        <div className="mb-5">
          <input
            type="submit"
            value="Iniciar sesión"
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
          />
        </div>

        <div className="mt-6 text-center">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to={ROUTES.SIGNUP} className="text-primary">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
