import Breadcrumb from '../common/components/Breadcrumb.tsx';
import ChartFour from '../common/components/ChartFour.tsx';
import ChartOne from '../common/components/ChartOne.tsx';
import ChartThree from '../common/components/ChartThree.tsx';
import ChartTwo from '../common/components/ChartTwo.tsx';

const Chart = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartFour />
        </div>
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
