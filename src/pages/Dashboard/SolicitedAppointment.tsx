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

interface Props {
  event: SchedulerHelpers;
  getSchedules: () => {};
}

export const SolicitedAppointment: React.FC<Props> = ({
  event,
  getSchedules,
}) => {
  const { user } = useAppSelector(selectAuthSlice);
  const { roles } = user;

  const { state, edited }: any = event;
  // const start = state.start.value;
  // const end = state.end.value;

  const { _id } = edited;

  const [loading, setLoading] = useState(false);

  const isStudent = roles.includes(Roles.STUDENT);
  const isTeacher = roles.includes(Roles.TEACHER);

  const [modalRejectOpen, setModalRejectOpen] = useState(false);
  const [modalAcceptOpen, setModalAcceptOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState('');
  const [acceptValue, setAcceptValue] = useState(0);

  const handleOpenRejectModal = () => {
    setModalRejectOpen(true);
  };

  const handleOpenAcceptModal = () => {
    setModalAcceptOpen(true);
  };

  const handleCloseModal = () => {
    setModalRejectOpen(false);
    setModalAcceptOpen(false);
  };

  const handleReject = async () => {
    if (!rejectMessage) {
      toast.error('Por favor escribe un mensaje de rechazo');
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

  const handleAccept = async () => {
    if (acceptValue <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    try {
      await AppointmentService.acceptAppointment(_id, acceptValue);
      toast.success('Asesoría aceptada correctamente');
      getSchedules();
      handleCloseModal();
      event.close();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="m-5 w-auto">
      <AppointmentInfo {...edited} />

      <div className="flex mx-2 gap-2 border-t-2 pt-2 border-inactive border-dashed">
        {isTeacher ? (
          <>
            <GlobalButton
              backgroundColor="success"
              text="Aceptar"
              onClick={handleOpenAcceptModal}
            />
            <GlobalButton
              backgroundColor="danger"
              text="Rechazar"
              onClick={handleOpenRejectModal}
            />
          </>
        ) : null}

        {isStudent ? (
          <div className="flex w-full justify-center items-center">
            Esperando la respuesta del profe{' '}
            <FiClock className="w-4 h-4 ml-1" />
          </div>
        ) : null}
      </div>

      {/* Modal for reject message */}
      <Modal
        open={modalRejectOpen}
        onClose={handleCloseModal}
        className="modal flex justify-center items-center"
      >
        <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-100 ">
          <h3 className="text-xl font-satoshi mb-2">
            Ingresa el motivo de rechazo
          </h3>
          <TextField
            label="Mensaje de rechazo"
            multiline
            className="w-full"
            helperText="Describe porqué se rechaza la asesoría"
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

      {/* Modal for accept value */}
      <Modal
        open={modalAcceptOpen}
        onClose={handleCloseModal}
        className="modal flex justify-center items-center"
      >
        <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-100">
          {/* <TextField /> */}
          <h3 className="text-xl font-satoshi mb-2">
            Ingresa el monto a cobrar
          </h3>

          <InputNumber
          
            inputId="currency-us"
            value={acceptValue}
            onValueChange={(e) => setAcceptValue(e.value!)}
            mode="decimal"
            prefix="$ " 
            suffix="  COP"
            min={0}
            showButtons
            buttonLayout="horizontal"
            step={1000}
            decrementButtonClassName="bg-danger text-white"
            incrementButtonClassName="bg-success text-white"
            incrementButtonIcon={<FaPlus />}
            decrementButtonIcon={<FaMinus />}
            className="w-full"
            inputClassName="w-full border border-stroke bg-transparent py-4 pl-6 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border"
          />
          <div className="mt-4 flex justify-end gap-2">
            <GlobalButton text="Aceptar" onClick={handleAccept} />
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