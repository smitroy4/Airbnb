import AuthLayout from "../layouts/AuthLayout";
import Card from "../components/common/Card";

function RegisterPage() {
  return (
    <AuthLayout>
      <Card>
        <h2 className="text-center text-2xl font-bold">
          Create Account
        </h2>

        <p className="mt-3 text-center text-gray-500">
          Registration form coming next.
        </p>
      </Card>
    </AuthLayout>
  );
}

export default RegisterPage;