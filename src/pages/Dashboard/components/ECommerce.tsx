import CardFour from '../../../common/components/CardFour.tsx';
import CardOne from '../../../common/components/CardOne.tsx';
import CardThree from '../../../common/components/CardThree.tsx';
import CardTwo from '../../../common/components/CardTwo.tsx';
import ChartOne from '../../../common/components/ChartOne.tsx';
import ChartThree from '../../../common/components/ChartThree.tsx';
import ChartTwo from '../../../common/components/ChartTwo.tsx';
import ChatCard from '../../../common/components/ChatCard.tsx';
import MapOne from '../../../common/components/MapOne.tsx';
import TableOne from '../../../common/components/TableOne.tsx';

const ECommerce = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
