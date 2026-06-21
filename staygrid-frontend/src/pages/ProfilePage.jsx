import DashboardLayout from "../layouts/DashboardLayout";

import { useAuth } from "../context/AuthContext";

import Card from "../components/common/Card";
import Button from "../components/common/Button";

function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout>
      <Card>
        <h1 className="mb-6 text-3xl font-bold">
          Profile
        </h1>

        <div className="space-y-3">
          <p>
            <strong>User ID:</strong> {user?.id}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Roles:</strong> {user?.roles}
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={logout}
            className="w-auto bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default ProfilePage;