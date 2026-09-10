"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="admin-login-form" noValidate>
      <div className="form-field">
        <label htmlFor="password">Admin Password</label>
        <input type="password" id="password" name="password" required autoComplete="current-password" autoFocus />
      </div>

      {state.error ? (
        <p className="form-field__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
