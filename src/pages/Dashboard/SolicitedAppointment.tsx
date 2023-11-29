import { useState } from 'react';
import { SchedulerHelpers } from '@aldabil/react-scheduler/types';
import { FiClock } from 'react-icons/fi';
import dayjs from 'dayjs';
import { Modal, Button, TextField } from '@mui/material';
import toast from 'react-hot-toast';

import 'react-responsive-modal/styles.css';

import { AppointmentInfo } from './AppointmentInfo';
import { GlobalButton } from '../../components';
import { useAppSelector } from '../../hooks';
import { selectAuthSlice } from '../../store/reducers/auth/authSlice';
import { Roles } from '../../enums';
import { AppointmentService } from '../../services';

enum FormKeys {
  START = 'start',
}
interface IFormInput {
  [FormKeys.START]: Date;
}

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
  const start = state.start.value;
  const end = state.end.value;

  const { _id } = edited;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<IFormInput>({
    [FormKeys.START]: dayjs(start).toDate(),
  });

  const isStudent = roles.includes(Roles.STUDENT);
  const isTeacher = roles.includes(Roles.TEACHER);

  const [modalOpen, setModalOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState('');

  const handleOpenRejectModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleReject = async () => {
    if (!rejectMessage) {
      toast.error('Por favor escribe un mensaje de rechazo');
      return;
    }

    try {
      await AppointmentService.rejectAppointment(_id, rejectMessage);
      toast.success('Asesoría rechazada correctamente');
      getSchedules()
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
            <GlobalButton backgroundColor="success" text="Aceptar" />
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
        open={modalOpen}
        onClose={handleCloseModal}
        className="modal flex justify-center items-center"
      >
       
        <div className="modal-content p-4 pt-6 bg-white rounded shadow-md w-100 ">
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
    </div>
  );
};
