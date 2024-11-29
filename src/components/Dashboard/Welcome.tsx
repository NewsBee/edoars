import CalendarActionCard from "../CalenderBox/CalendarNew";
import GreetingCard from "../Card/GreetingCard";
import PieChartCard from "../Charts/PieChart";

const DashboardMainContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Greeting Card */}
      <div className="lg:col-span-2">
        <GreetingCard />
      </div>

      {/* Calendar Action Card */}
      <div className="lg:col-span-1 lg:row-span-2">
        <CalendarActionCard />
      </div>

      {/* Pie Chart */}
      <div className="lg:col-span-2">
        <PieChartCard />
      </div>
    </div>
  );
};

export default DashboardMainContent;
