import React, { useEffect, useState } from 'react';
import { SchedulerHelpers } from '@aldabil/react-scheduler/types';
import { Modal, Rating, TextField } from '@mui/material';
import toast from 'react-hot-toast';

import { AppointmentInfo } from './AppointmentInfo';
import { GlobalButton } from '../../../components';
import { useAppSelector } from '../../../hooks';
import { selectAuthSlice } from '../../../store/reducers/auth/authSlice';
import { Roles } from '../../../enums';
import { IAppointment, IDataAppointment } from '../../../interfaces';
import dayjs from 'dayjs';
import { AppointmentService } from '../../../services';

interface Props {
  event: SchedulerHelpers;
  getSchedules: () => {};
  appointment: IAppointment | null;
}

export const CompletedAppointment: React.FC<Props> = ({
  event,
  getSchedules,
  appointment,
}) => {
  const { user } = useAppSelector(selectAuthSlice);
  const { roles } = user;

  const { edited }: any = event;

  const { _id, data, review } = edited;

  const [loading, setLoading] = useState(false);

  const isStudent = roles.includes(Roles.STUDENT);
  const isTeacher = roles.includes(Roles.TEACHER);

  const [modalReviewOpen, setModalReviewOpen] = useState(false);
  const [value, setValue] = useState(4);
  const [text, setText] = useState('');

  const handleOpenReviewModal = () => {
    setModalReviewOpen(true);
  };

  const handleCloseModal = () => {
    setModalReviewOpen(false);
  };

  const handleSubmitReview = async () => {
    if (!text) return toast.error('Espera, déjanos saber tu opinión en texto');

    try {
      await AppointmentService.addReview(_id, value, text);
      toast.success('Calificación enviada');
      handleCloseModal();
      event.close();
      getSchedules();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const infoAppointment = { ...edited, payment: appointment?.payment };

  return (
    <div className="m-5 w-auto">
      <AppointmentInfo {...infoAppointment} />

      <div className="flex mx-2 gap-2 border-t-2 pt-2 border-inactive border-dashed">
        <div className="block w-full">
          {data?.length ? (
            <div className="font-medium">
              Material dejado por el docente:
              <ul>
                {data.map(({ text, url }: IDataAppointment, index: number) => (
                  <li key={index}>
                    {'•'}{' '}
                    <a
                      href={url}
                      target="_blank"
                      className="text-meta-5 underline"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-4 w-full">
            {isStudent && !review ? (
              <GlobalButton
                text="Califica la asesoría"
                onClick={handleOpenReviewModal}
              />
            ) : null}

            {isTeacher && review ? (
              <div className="font-medium">
                <div className="flex">
                  <h3 className="">Opinión del estudiante:</h3>
                  {'  '}
                  <Rating name="disabled" value={review?.value} disabled />
                </div>
                <span className="font-thin">{review?.text}</span>
              </div>
            ) : null}
          </div>
        </div>

        <Modal
          open={modalReviewOpen}
          onClose={handleCloseModal}
          className="modal flex justify-center items-center"
        >
          <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-100 ">
            <h3 className="text-xl font-satoshi mb-2">
              ¿Qué tal te pareció la asesoría?
            </h3>
            <Rating
              value={value}
              onChange={(event: any, newValue: any) => {
                setValue(newValue);
              }}
            />
            <TextField
              multiline
              className="w-full"
              helperText="Ayúdanos a mejorar"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <GlobalButton text="Enviar" onClick={handleSubmitReview} />
              <GlobalButton
                text="Cancelar"
                backgroundColor="danger"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
