import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

import { Errors, ROUTES } from '../../../enums';
import { CustomInput } from '../../../components';
import { PatterRegex } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { startLogin } from '../../../store';
import { selectAuthSlice } from '../../../store/reducers/auth/authSlice';
import toast from 'react-hot-toast';

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

  const navigate = useNavigate()

  const { error } = useAppSelector(selectAuthSlice);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<IFormInput>();

  const PasswordIcon = showPassword ? BsEye : BsEyeSlash;
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const passwordInputType = showPassword ? 'text' : 'password';

  const handleInvalidCredentials = () => {
    toast.error('Correo o contraseña incorrectos', {id: 'error'});
    setError('email', { message: 'Revisa el correo, puede estar incorrecto' });
    setError('password', {
      message: 'Revisa la contraseña, puede ser incorrecta',
    });
  };
  const handleEmailInvalid = () => {
    toast.error('Correo invalido', {id: 'error'});
    setError('email', {
      message:
        'Parece que el correo que ingresaste no es valido, intenta con otro',
    });
  };
  const handlePasswordInvalid = () => {
    toast.error('Contraseña invalida', {id: 'error'});
    setError('password', {
      message:
        'Debe tener al menos una letra, un número y un carácter especial',
    });
  };

  const handleErrors = (error: string) => {
    if (error === Errors.INVALID_CREDENTIALS) return handleInvalidCredentials();
    if (error === Errors.EMAIL_INVALID) return handleEmailInvalid();
    if (error === Errors.PASSWORD_INVALID) return handlePasswordInvalid();
    toast.error('Ha ocurrido un error', {id: 'error'});
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    toast.remove('error');
    toast.loading('Cargando...', { id: 'loading' });
    const { success, error } = await dispatch(startLogin(data));
    toast.remove('loading');
    if (success) {
     toast.success('Sesión iniciada correctamente');
     return navigate('/')
    }
    handleErrors(error);
  };

  return (
    <div className="">
      <h2 className="mb-9 text-2xl font-bold text-primary-600 dark:text-white sm:text-title-xl2">
        Inicia sesión con tu LitoCuenta
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
