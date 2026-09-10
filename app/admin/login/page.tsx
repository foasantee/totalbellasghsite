import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Total Bellas Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
}
