import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';

import { useFetch } from '../../hooks';
import { SubjectsService } from '../../services';
import { Loader } from '../../common';
import { ISubject } from '../../interfaces';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import toast from 'react-hot-toast';
import { Message } from 'primereact/message';

const HandleImage = ({ img }: ISubject) => {
  return (
    <Image
      src={img}
      alt="Image"
      imageClassName="rounded-md"
      loading="lazy"
      preview
      width="160"
      height="120"
    />
  );
};

const HandleChangeStatus = ({ _id, name, isActive }: ISubject) => {
  const [checked, setChecked] = useState(isActive);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnCheck = async (e: InputSwitchChangeEvent) => {
    setIsLoading(true);
    try {
      await SubjectsService.updateSubject({ _id, isActive: !checked });
      toast.success(
        `La materia ${name} ha sido ${!checked ? 'activada' : 'desactivada'}`,
      );
      setChecked(e.value);
    } catch (error) {
      toast.error('Ha ocurrido un error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader withoutContainer size={10} />;

  return <InputSwitch checked={checked} onChange={handleOnCheck} />;
};

const ListSubjects = () => {
  const {
    loading,
    data: subjects,
    error,
  } = useFetch(() => SubjectsService.listAll());

  if (loading) return <Loader />;
   
  if (error) {
    return (
      <div className="flex justify-center items-center">
        <Message severity="error" text={'Ha ocurrido un error'} />
      </div>
    );
  }
  
  return (
    <DataTable value={subjects} tableStyle={{ minWidth: '30rem' }}>
      <Column field="name" header="Nombre"></Column>
      <Column
        field="img"
        header="Imagen"
        body={(e) => <HandleImage {...e} />}
      ></Column>
      <Column
        field="isActive"
        header="¿Está activa?"
        body={(e) => <HandleChangeStatus {...e} />}
      ></Column>
    </DataTable>
  );
};

export default ListSubjects;
