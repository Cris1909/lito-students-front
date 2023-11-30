import React, { useEffect, useState } from 'react';
import { SchedulerHelpers } from '@aldabil/react-scheduler/types';
import { Modal, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
} from 'react-hook-form';

import { AppointmentInfo } from './AppointmentInfo';
import { GlobalButton } from '../../components';
import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';
import { Roles } from '../../enums';
import { AppointmentService } from '../../services';
import { IAppointment, IDataAppointment } from '../../interfaces';
import dayjs from 'dayjs';

interface Props {
  event: SchedulerHelpers;
  getSchedules: () => {};
  appointment: IAppointment | null;
}

interface CompletedAppointmentFormData {
  data: IDataAppointment[];
}

const isURLValid = (url: string) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
};

export const ConfirmedAppointment: React.FC<Props> = ({
  event,
  getSchedules,
  appointment,
}) => {
  const { user } = useAppSelector(selectAuthSlice);
  const { roles } = user;

  const { state, edited }: any = event;
  const start = state.start.value;
  const end = state.end.value;

  const { _id } = edited;

  const [loading, setLoading] = useState(false);

  const isTeacher = roles.includes(Roles.TEACHER);

  const [modalCompletedOpen, setModalCompletedOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
  } = useForm<CompletedAppointmentFormData>({
    defaultValues: {
      data: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'data',
  });

  const handleOpenCompletedModal = () => {
    setModalCompletedOpen(true);
  };

  const handleAccept: SubmitHandler<CompletedAppointmentFormData> = async (
    data,
  ) => {
    if (data.data.some((e) => !e.text || !e.url))
      return toast.error('No puedes enviar campos vacíos');

    const areAllURLsValid = data.data.every((item) => isURLValid(item.url));

    if (!areAllURLsValid) return toast.error('Hay una url invalida');

    try {
      await AppointmentService.completedAppointment(_id, data.data);
      toast.success('Asesoría completada');
      handleCloseModal();
      event.close();
      getSchedules();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setModalCompletedOpen(false);
  };

  const isBeforeStart = dayjs().isBefore(start);
  const isAfterEnd = dayjs().isAfter(end);

  const displayText = isBeforeStart
    ? 'Aun falta para que la asesoría se haga'
    : isAfterEnd
    ? 'Asesoría completada, esperando que el docente lo indique'
    : 'La asesoría es ahora mismo';

  const infoAppointment = { ...edited, payment: appointment?.payment };

  useEffect(() => {
    append({ text: '', url: '' });
  }, []);

  return (
    <div className="m-5 w-auto">
      <AppointmentInfo {...infoAppointment} />

      <div className="flex mx-2 gap-2 border-t-2 pt-2 border-inactive border-dashed">
        {isAfterEnd && isTeacher ? (
          <GlobalButton
            backgroundColor="success"
            text="Marcar asesoría como completada"
            onClick={handleOpenCompletedModal}
          />
        ) : (
          <div className="flex w-full justify-center items-center">
            {displayText}
          </div>
        )}

        <Modal
          open={modalCompletedOpen}
          onClose={handleCloseModal}
          className="modal flex justify-center items-center "
        >
          <form onSubmit={handleSubmit(handleAccept)}>
            <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-full">
              {/* ... */}
              <h3 className="text-xl font-satoshi mb-2">
                Ingresa los enlaces que quieras añadir
              </h3>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-4">
                  <TextField
                    label={`Texto número ${index + 1}`}
                    className="w-full"
                    {...register(`data.${index}.text`)}
                  />
                  <TextField
                    label={`URL número ${index + 1}`}
                    className="w-full"
                    {...register(`data.${index}.url`)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-danger text-white px-3 py-1 rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ text: '', url: '' })}
                className="bg-success text-white px-3 py-1 rounded-lg"
              >
                Agregar +
              </button>

              <div className="mt-4 flex justify-end gap-2">
                <GlobalButton text="Aceptar" type="submit" />
                <GlobalButton
                  text="Cancelar"
                  backgroundColor="danger"
                  onClick={handleCloseModal}
                />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
