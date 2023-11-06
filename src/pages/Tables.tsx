import Breadcrumb from '../common/components/Breadcrumb';
import TableOne from '../common/components/TableOne';
import TableThree from '../common/components/TableThree';
import TableTwo from '../common/components/TableTwo';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
  );
};

export default Tables;
