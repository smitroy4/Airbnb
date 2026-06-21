import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getHotelReport,
} from "../api/adminReportApi";

function AdminReportsPage() {
  const { hotelId } =
    useParams();

  const [report, setReport] =
    useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport =
    async () => {
      try {
        const data =
          await getHotelReport(
            hotelId
          );

        setReport(data);
      } catch (error) {
        console.error(error);
      }
    };

  if (!report) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6">
          <h3>
            Bookings
          </h3>

          <p className="mt-4 text-4xl font-bold">
            {
              report.bookingCount
            }
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <h3>
            Revenue
          </h3>

          <p className="mt-4 text-4xl font-bold">
            ₹
            {
              report.totalRevenue
            }
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <h3>
            Average Revenue
          </h3>

          <p className="mt-4 text-4xl font-bold">
            ₹
            {
              report.avgRevenue
            }
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminReportsPage;