import {
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  UseFormSetError,
  useForm,
} from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { PatterRegex } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectAuthSlice } from '../../../store/reducers/auth/authSlice';
import { useState } from 'react';
import { CustomInput } from '../../../components';
import { MdOutlineMailOutline } from 'react-icons/md';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { AiOutlinePhone, AiOutlineUser } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { startRegister } from '../../../store';
import { Errors } from '../../../enums';



const iconStyle = { width: 22, height: 22 };

enum FormKeys {
  EMAIL = 'email',
  PASSWORD = 'password',
  NAME = 'name',
  PHONE_NUMBER = 'phoneNumber'
}

interface IFormInput {
  [FormKeys.EMAIL]: string;
  [FormKeys.PASSWORD]: string;
  [FormKeys.NAME]: string;
  [FormKeys.PHONE_NUMBER]: string;
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

const nameValidations: RegisterOptions<FieldValues> = {
  required: 'El nombre es requerido',
  minLength: {
    value: 3,
    message: 'El nombre debe tener al menos 3 caracteres',
  },
};

const phoneNumberValidations: RegisterOptions<FieldValues> = {
  required: 'El número de teléfono es requerido',
  minLength: {
    value: 10,
    message: 'El número de teléfono debe tener 10 caracteres',
  },
  maxLength: {
    value: 10,
    message: 'El número de teléfono debe tener 10 caracteres',
  },
  pattern: {
    value: PatterRegex.phoneNumber,
    message: 'El número de teléfono debe empezar por 3 y tener solo digitos',
  },
};

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

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
    [Errors.NAME_MUST_BE_STRING]: () => handleGenericError(FormKeys.NAME, 'Nombre inválido', 'El nombre debe ser una cadena de caracteres'),
    [Errors.PHONE_NUMBER_INVALID]: () => handleGenericError(FormKeys.PHONE_NUMBER, 'Número de teléfono inválido', 'El número de teléfono ingresado no es válido'),
    [Errors.NAME_NOT_SEND]: () => handleGenericError(FormKeys.NAME, 'Nombre no proporcionado', 'Debes proporcionar un nombre'),
    [Errors.NAME_TOO_SHORT]: () => handleGenericError(FormKeys.NAME, 'Nombre demasiado corto', 'El nombre debe tener al menos 3 caracteres'),
    [Errors.EMAIL_ALREADY_EXIST]: () => handleGenericError(FormKeys.EMAIL, 'Este correo ya está registrado', 'El correo que ingresaste ya se encuentra registrado, intenta con otro'),
    [Errors.PHONE_NUMBER_ALREADY_EXIST]: () => handleGenericError(FormKeys.PHONE_NUMBER, 'Este número de teléfono ya está registrado', 'El número de teléfono que ingresaste ya se encuentra registrado, intenta con otro'),
  };

  const handleGenericError = (field: FormKeys, toastMessage: string, errorMessage: string) => {
    toast.error(toastMessage, { id: 'error' });
    setError(field, { message: errorMessage });
  };
  
  const handleErrors = (error: any) => {
    const errorHandler = errorHandlers[error];
    if (errorHandler) {
      errorHandler();
    } else {
      toast.error('Ha ocurrido un error', { id: 'error' });
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    toast.remove('error');
    toast.loading('Cargando...', { id: 'loading' });
    const { success, error } = await dispatch(startRegister(data));
    toast.remove('loading');
    if (success) {
     toast.success('Cuenta creada exitosamente');
     return navigate('/')
    }
    handleErrors(error);
  };

  return (
    <>
      <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Regístrate
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          register={register}
          name="name"
          label="Nombre completo"
          icon={<AiOutlineUser style={iconStyle} />}
          type="text"
          rules={nameValidations}
          placeholder={'Alejandra Martinez'}
          autoComplete="name"
          error={errors.name}
        />

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
          name="phoneNumber"
          label="Número de teléfono"
          icon={<AiOutlinePhone style={iconStyle} />}
          type="tel"
          rules={phoneNumberValidations}
          placeholder={'3123456789'}
          autoComplete="tel"
          error={errors.phoneNumber}
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
          autoComplete="off"
          rules={passwordValidations}
          error={errors.password}
        />

        <div className="mb-5">
          <input
            type="submit"
            value="Crear cuenta"
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
          />
        </div>
        <div className="mt-6 text-center">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/auth/signin" className="text-primary">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
