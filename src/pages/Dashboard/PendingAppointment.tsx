import React, { useState } from 'react';
import { SchedulerHelpers } from '@aldabil/react-scheduler/types';
import { FiClock } from 'react-icons/fi';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Modal, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { InputNumber } from 'primereact/inputnumber';

import { AppointmentInfo } from './AppointmentInfo';
import { GlobalButton } from '../../components';
import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';
import { Roles } from '../../enums';
import { AppointmentService } from '../../services';
import { IAppointment } from '../../interfaces';
import { Image } from 'primereact/image';

import nequiQR from '../../assets/images/nequiQR.jpeg';

interface Props {
  event: SchedulerHelpers;
  getSchedules: () => {};
  appointment: IAppointment | null;
}

export const PendingAppointment: React.FC<Props> = ({
  event,
  getSchedules,
  appointment,
}) => {
  const { user } = useAppSelector(selectAuthSlice);
  const { roles } = user;

  const { state, edited }: any = event;
  // const start = state.start.value;
  // const end = state.end.value;

  const { _id, teacher } = edited;

  const [loading, setLoading] = useState(false);

  const isStudent = roles.includes(Roles.STUDENT);
  const isTeacher = roles.includes(Roles.TEACHER);

  const [modalRejectOpen, setModalRejectOpen] = useState(false);
  const [modalPayOpen, setModalPayOpen] = useState(false);
  const [modalConfirmPayOpen, setModalConfirmPayOpen] = useState(false);

  const [rejectMessage, setRejectMessage] = useState('');
  const [acceptValue, setAcceptValue] = useState(0);

  const handleOpenRejectModal = () => {
    setModalRejectOpen(true);
  };

  const handleOpenPayModal = () => {
    setModalPayOpen(true);
  };

  const handleOpenConfirmPay = () => {
    setModalConfirmPayOpen(true);
  };

  const handleCloseModal = () => {
    setModalRejectOpen(false);
    setModalPayOpen(false);
    setModalConfirmPayOpen(false);
  };

  const handleConfirmPay = async () => {
    try {
      await AppointmentService.confirmAppointment(_id);
      toast.success('Pago confirmado');
      handleCloseModal();
      event.close();
      getSchedules()
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async () => {
    if (!rejectMessage) {
      toast.error('Por favor escribe un mensaje de cancelación');
      return;
    }

    try {
      await AppointmentService.rejectAppointment(_id, rejectMessage);
      toast.success('Asesoría rechazada correctamente');
      getSchedules();
      handleCloseModal();
      event.close();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleNotifyPayment = async () => {
    toast.success('Se ha notificado al docente, espera que confirme el pago');
    handleCloseModal();
  };

  const infoAppointment = { ...edited, payment: appointment?.payment };

  return (
    <div className="m-5 w-auto">
      <AppointmentInfo {...infoAppointment} />
      {isTeacher ? (
        <>
          <div className="flex mx-2 gap-2 border-t-2 pt-2 border-inactive border-dashed">
            <GlobalButton
              backgroundColor="success"
              text="Confirmar pago"
              onClick={handleOpenConfirmPay}
            />
            <GlobalButton
              backgroundColor="danger"
              text="Cancelar asesoría"
              onClick={handleOpenRejectModal}
            />
          </div>
          <div className="flex w-full justify-center items-center">
            Esperando el pago del alumno <FiClock className="w-4 h-4 ml-1" />
          </div>
        </>
      ) : null}

      {isStudent ? (
        <div className="flex mx-2 gap-2 border-t-2 pt-2 border-inactive border-dashed">
          <GlobalButton
            backgroundColor="success"
            text="Pagar asesoría"
            onClick={handleOpenPayModal}
          />{' '}
        </div>
      ) : null}

      <Modal
        open={modalRejectOpen}
        onClose={handleCloseModal}
        className="modal flex justify-center items-center"
      >
        <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-100 ">
          <h3 className="text-xl font-satoshi mb-2">
            Envia un mensaje para el estudiante
          </h3>
          <TextField
            label="Mensaje de cancelación"
            multiline
            className="w-full"
            helperText="Describe porqué se cancela la asesoría"
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
          />
          <div className="mt-4 flex justify-end gap-2">
            <GlobalButton text="Enviar" onClick={handleReject} />
            <GlobalButton
              text="Cancelar"
              backgroundColor="danger"
              onClick={handleCloseModal}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={modalPayOpen}
        onClose={handleCloseModal}
        className="modal flex justify-center items-center"
      >
        <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-100">
          <div className="font-medium">
            <p>
              Nequi del profesor:{' '}
              <span className="font-thin">{teacher.name}</span>
            </p>
            <p>
              Número: <span className="font-thin">{teacher.phoneNumber}</span>
            </p>
            <p>
              Valor:{' '}
              <span className="font-thin">
                {' '}
                $ {appointment?.payment?.value.toLocaleString('en')} COP
              </span>
            </p>
          </div>
          <Image src={nequiQR} alt="QR de nequi" loading="lazy" />
          <div className="mt-4 justify-end gap-2">
            <GlobalButton
              text="Confirmar pago"
              onClick={handleNotifyPayment}
              backgroundColor="success"
            />
            <div className="flex w-full justify-center items-center">
              Debes esperar que el docente confirme el pago
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={modalConfirmPayOpen}
        onClose={handleOpenConfirmPay}
        className="modal flex justify-center items-center"
      >
        <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-100">
          <div className="font-medium text-center">
            ¿Estás seguro, no podrás deshacer esta acción?
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <GlobalButton
              text="Enviar"
              onClick={handleConfirmPay}
              backgroundColor="success"
            />
            <GlobalButton
              text="Cancelar"
              backgroundColor="danger"
              onClick={handleCloseModal}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
