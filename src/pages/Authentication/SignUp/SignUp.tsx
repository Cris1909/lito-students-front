import { useState } from 'react';
import {
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdOutlineMailOutline } from 'react-icons/md';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { AiOutlinePhone, AiOutlineUser } from 'react-icons/ai';

import { PatterRegex } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectAuthSlice } from '../../../store/reducers/auth/authSlice';
import { CustomInput, GlobalButton } from '../../../components';
import { startRegister } from '../../../store';
import { Errors, ROUTES } from '../../../enums';

const iconStyle = { width: 22, height: 22 };

enum FormKeys {
  EMAIL = 'email',
  PASSWORD = 'password',
  NAME = 'name',
  PHONE_NUMBER = 'phoneNumber',
  HAS_SPECIAL_NEEDS = 'hasSpecialNeeds',
  NEEDS_EMOTIONAL_SUPPORT = 'needsEmotionalSupport',
}

interface IFormInput {
  [FormKeys.EMAIL]: string;
  [FormKeys.PASSWORD]: string;
  [FormKeys.NAME]: string;
  [FormKeys.PHONE_NUMBER]: string;
  [FormKeys.HAS_SPECIAL_NEEDS]: boolean;
  [FormKeys.NEEDS_EMOTIONAL_SUPPORT]: boolean;
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
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState<boolean>(false);
  const [needsEmotionalSupport, setNeedsEmotionalSupport] = useState<boolean>(false);

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
    [Errors.EMAIL_INVALID]: () =>
      handleGenericError(
        FormKeys.EMAIL,
        'Correo inválido',
        'Parece que el correo que ingresaste no es válido, intenta con otro',
      ),
    [Errors.PASSWORD_INVALID]: () =>
      handleGenericError(
        FormKeys.PASSWORD,
        'Contraseña inválida',
        'Debe tener al menos una letra, un número y un carácter especial',
      ),
    [Errors.NAME_MUST_BE_STRING]: () =>
      handleGenericError(
        FormKeys.NAME,
        'Nombre inválido',
        'El nombre debe ser una cadena de caracteres',
      ),
    [Errors.PHONE_NUMBER_INVALID]: () =>
      handleGenericError(
        FormKeys.PHONE_NUMBER,
        'Número de teléfono inválido',
        'El número de teléfono ingresado no es válido',
      ),
    [Errors.NAME_NOT_SEND]: () =>
      handleGenericError(
        FormKeys.NAME,
        'Nombre no proporcionado',
        'Debes proporcionar un nombre',
      ),
    [Errors.NAME_TOO_SHORT]: () =>
      handleGenericError(
        FormKeys.NAME,
        'Nombre demasiado corto',
        'El nombre debe tener al menos 3 caracteres',
      ),
    [Errors.EMAIL_ALREADY_EXIST]: () =>
      handleGenericError(
        FormKeys.EMAIL,
        'Este correo ya está registrado',
        'El correo que ingresaste ya se encuentra registrado, intenta con otro',
      ),
    [Errors.PHONE_NUMBER_ALREADY_EXIST]: () =>
      handleGenericError(
        FormKeys.PHONE_NUMBER,
        'Este número de teléfono ya está registrado',
        'El número de teléfono que ingresaste ya se encuentra registrado, intenta con otro',
      ),
  };

  const handleGenericError = (
    field: FormKeys,
    toastMessage: string,
    errorMessage: string,
  ) => {
    toast.error(toastMessage, { id: 'error' });
    setError(field, { message: errorMessage });
  };

  const handleErrors = (error: any) => {
    const errorHandler = errorHandlers[error];
    if (errorHandler) return errorHandler();
    toast.error('Ha ocurrido un error', { id: 'error' });
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Si marca alguna opción de necesidades especiales, redirigir a página informativa
    if (hasSpecialNeeds || needsEmotionalSupport) {
      return navigate(ROUTES.ACCESSIBILITY_INFO, {
        state: {
          hasSpecialNeeds,
          needsEmotionalSupport,
          userData: data
        }
      });
    }

    toast.remove('error');
    toast.loading('Cargando...', { id: 'loading' });
    const { success, error } = await dispatch(startRegister(data));
    toast.remove('loading');
    if (success) {
      toast.success('Cuenta creada exitosamente');
      return navigate(ROUTES.DASHBOARD);
    }
    handleErrors(error);
  };

  return (
    <>
      <h2 className="mb-9 text-2xl font-bold text-primary-600 dark:text-white sm:text-title-xl2">
        Regístrate
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          register={register}
          name={FormKeys.NAME}
          label="Nombre completo"
          icon={<AiOutlineUser style={iconStyle} />}
          type="text"
          rules={nameValidations}
          placeholder={'Alejandra Martinez'}
          autoComplete="name"
          error={errors[FormKeys.NAME]}
        />

        <CustomInput
          register={register}
          name={FormKeys.EMAIL}
          label="Correo"
          icon={<MdOutlineMailOutline style={iconStyle} />}
          type="email"
          rules={emailValidations}
          placeholder={'example@gmail.com'}
          autoComplete="off"
          error={errors[FormKeys.EMAIL]}
        />

        <CustomInput
          register={register}
          name={FormKeys.PHONE_NUMBER}
          label="Número de teléfono"
          icon={<AiOutlinePhone style={iconStyle} />}
          type="tel"
          rules={phoneNumberValidations}
          placeholder={'3123456789'}
          autoComplete="tel"
          error={errors[FormKeys.PHONE_NUMBER]}
        />

        <CustomInput
          register={register}
          name={FormKeys.PASSWORD}
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
          error={errors[FormKeys.PASSWORD]}
          
        />

        <div className="mb-6 mt-8 space-y-4 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Para brindarte una mejor experiencia 💙
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex-1 pr-4">
              <label htmlFor="hasSpecialNeeds" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                ¿Requieres apoyo educativo especializado?
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Por ejemplo: dislexia, TDAH, autismo, discapacidad visual o auditiva
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="hasSpecialNeeds"
                className="sr-only peer"
                checked={hasSpecialNeeds}
                onChange={(e) => setHasSpecialNeeds(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex-1 pr-4">
              <label htmlFor="needsEmotionalSupport" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                ¿Te gustaría recibir apoyo emocional?
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Estamos aquí para acompañarte en momentos difíciles
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="needsEmotionalSupport"
                className="sr-only peer"
                checked={needsEmotionalSupport}
                onChange={(e) => setNeedsEmotionalSupport(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="mb-5">
          <GlobalButton disabled={loading} type="submit" text="Crear cuenta" />
        </div>
        <div className="mt-6 text-center">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to={ROUTES.SIGNIN} className="text-primary">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
