import React, { useEffect, useState } from 'react';
import {
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { BiPencil, BiImageAdd } from 'react-icons/bi';
import { Image } from 'primereact/image';
import { Card } from 'primereact/card';
import toast from 'react-hot-toast';

import { GlobalButton, CustomInput } from '../../components';
import { SubjectsService } from '../../services';

import { isImageUrl } from '../../helpers';
import { PatterRegex } from '../../constants';
import { Errors } from '../../enums';
import { ISubject } from '../../interfaces';

import DEFAULT_IMAGE from '../../assets/images/default-image.png';
import dayjs from 'dayjs';

enum FormKeys {
  NAME = 'name',
  IMG = 'img',
}
interface IFormInput {
  [FormKeys.NAME]: string;
  [FormKeys.IMG]: string;
}

const nameValidations: RegisterOptions<FieldValues> = {
  required: {
    value: true,
    message: 'El nombre es requerido',
  },
  min: {
    value: 3,
    message: 'El nombre debe tener mas de 3 caracteres',
  },
};

const imageValidations: RegisterOptions<FieldValues> = {
  required: {
    value: true,
    message: 'La url de la imagen es requerida',
  },
  pattern: {
    value: PatterRegex.url,
    message: 'La imagen debe ser una url valida',
  },
};

const CreateSubject = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch,
    reset,
  } = useForm<IFormInput>();

  const watchName = watch(FormKeys.NAME, undefined);
  const watchImage = watch(FormKeys.IMG, undefined);

  const [displayImage, setDisplayImage] = useState<string>(DEFAULT_IMAGE);
  const [isValidImage, setIsValidImage] = useState<boolean>(false);

  const [createdSubject, setCreatedSubject] = useState<ISubject | null>(null);

  const validateImage = async () => {
    const isValidImage = await isImageUrl(watchImage);
    const displayImage = isValidImage ? watchImage : DEFAULT_IMAGE;
    setDisplayImage(displayImage);
    setIsValidImage(isValidImage);
  };

  useEffect(() => {
    validateImage();
  }, [watchImage]);

  const errorHandlers: any = {
    [Errors.SUBJECT_ALREADY_EXIST]: () =>
      handleGenericError(
        FormKeys.NAME,
        'La materia ya existe',
        'El nombre que ingresaste ya está asociado a una materia',
      ),
    [Errors.NAME_NOT_SEND]: () =>
      handleGenericError(
        FormKeys.NAME,
        'El nombre no fue enviado',
        'El nombre es obligatorio',
      ),
    [Errors.NAME_TOO_SHORT]: () =>
      handleGenericError(
        FormKeys.NAME,
        'El nombre es muy corto',
        'El nombre debe tener al menos 3 caracteres',
      ),
    [Errors.IMG_NOT_SEND]: () =>
      handleGenericError(
        FormKeys.IMG,
        'la imagen no fue enviada',
        'La imagen de la materia es obligatoria',
      ),
    [Errors.IMG_MUST_BE_URL]: () =>
      handleGenericError(
        FormKeys.IMG,
        'La imagen es invalida',
        'La imagen debe ser una ur valida',
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
    toast.remove('error');
    toast.loading('Cargando...', { id: 'loading' });
    try {
      const response = await SubjectsService.createSubject(data);
      setCreatedSubject(response);
      toast.remove('loading');
      toast.success('Cuenta creada exitosamente');
    } catch (error: any) {
      toast.remove('loading');
      handleErrors(error.message);
    }
  };

  const handleClearForm = () => {
    reset();
    setCreatedSubject(null);
    setDisplayImage(DEFAULT_IMAGE);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {createdSubject ? null : (
          <div className="w-full md:w-1/2 p-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                label={'Nombre de la materia'}
                register={register}
                name={FormKeys.NAME}
                icon={<BiPencil />}
                error={errors[FormKeys.NAME]}
                placeholder="Ingles"
                autoComplete="off"
                rules={nameValidations}
              />
              <CustomInput
                label={'Imagen de la materia'}
                register={register}
                name={FormKeys.IMG}
                icon={<BiImageAdd />}
                error={errors[FormKeys.IMG]}
                placeholder={
                  'https://flowbite.com/docs/images/examples/image-1@2x.jpg'
                }
                autoComplete="off"
                rules={imageValidations}
              />
              <GlobalButton
                disabled={!(isValid && isValidImage)}
                type="submit"
                text="Crear Materia"
              />
            </form>
          </div>
        )}

        <div className="w-full md:w-1/2 flex justify-center p-2">
          <div className="animate__animated animate__fadeInRight">
            <div className="mt-2">
              {createdSubject ? (
                <small className="text-success">
                  ¡Materia creada exitosamente!
                </small>
              ) : (
                <small>Vista previa de la materia</small>
              )}
            </div>
            <Card
              title={watchName || 'Nombre de la materia'}
              header={
                <Image
                  src={displayImage}
                  alt="Image"
                  imageClassName="rounded-t-md"
                  loading="lazy"
                  preview={isValidImage}
                />
              }
              className="dark:border-form-strokedark dark:bg-form-input dark:text-stroke rounded-md w-full"
            ></Card>
            {createdSubject ? (
              <>
              <br />
              <GlobalButton
                text="Crear otra materia"
                onClick={handleClearForm}
                />
                </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateSubject;
