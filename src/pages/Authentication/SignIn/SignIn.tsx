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
import toast from 'react-hot-toast';

import { Errors, ROUTES } from '../../../enums';
import { CustomInput, GlobalButton } from '../../../components';
import { PatterRegex } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { startLogin } from '../../../store';
import { selectAuthSlice } from '../../../store/reducers/auth/authSlice';

const iconStyle = { width: 22, height: 22 };

enum FormKeys {
  EMAIL = 'email',
  PASSWORD = 'password',
}
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
    value: PatterRegex.email,
    message: 'Email invalido',
  },
};

const passwordValidations: RegisterOptions<FieldValues> = {
  required: {
    value: true,
    message: 'La contraseña es requerida',
  },
  pattern: {
    value: PatterRegex.password,
    message: 'Debe tener al menos una letra, un número y un carácter especial',
  },
};

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate()

  const { loading } = useAppSelector(selectAuthSlice);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IFormInput>();

  const PasswordIcon = showPassword ? BsEye : BsEyeSlash;
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const passwordInputType = showPassword ? 'text' : 'password';

  const errorHandlers: any = {
    [Errors.EMAIL_INVALID]: () => handleGenericError(FormKeys.EMAIL, 'Correo inválido', 'Parece que el correo que ingresaste no es válido, intenta con otro'),
    [Errors.PASSWORD_INVALID]: () => handleGenericError(FormKeys.PASSWORD, 'Contraseña inválida', 'Debe tener al menos una letra, un número y un carácter especial'),
    [Errors.EMAIL_ALREADY_EXIST]: () => handleGenericError(FormKeys.EMAIL, 'Este correo ya está registrado', 'El correo que ingresaste ya se encuentra registrado, intenta con otro'),
  };

  const handleGenericError = (field: FormKeys, toastMessage: string, errorMessage: string) => {
    toast.error(toastMessage, { id: 'error' });
    setError(field, { message: errorMessage });
  };
  
  const handleErrors = (error: any) => {
    const errorHandler = errorHandlers[error];
    if (errorHandler) return errorHandler();
    toast.error('Ha ocurrido un error', { id: 'error' });
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    toast.remove('error');
    toast.loading('Cargando...', { id: 'loading' });
    const { success, error } = await dispatch(startLogin(data));
    toast.remove('loading');
    if (success) {
     toast.success('Sesión iniciada correctamente');
     return navigate(ROUTES.DASHBOARD)
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
          register={register}
          name="email"
          label="Correo"
          icon={<MdOutlineMailOutline style={iconStyle} />}
          type="email"
          rules={emailValidations}
          placeholder={'example@gmail.com'}
          autoComplete="email"
          error={errors.email}
        />

        <CustomInput
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
          placeholder="**********"
          type={passwordInputType}
          autoComplete="current-password"
          rules={passwordValidations}
          error={errors.password}
        />

        <div className="mb-5">
          <GlobalButton
            disabled={loading}
            type="submit"
            text="Iniciar sesión"
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
