"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/actions/contact";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);

  if (state.success) {
    return (
      <p className="form-status form-status--success" role="status">
        Thanks — your message has been received. We&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form action={formAction} noValidate>
      <div className="form-field">
        <label htmlFor="field-name">
          Full Name <span className="required" aria-hidden="true">*</span>
        </label>
        <input type="text" id="field-name" name="name" required autoComplete="name" />
      </div>

      <div className="form-field">
        <label htmlFor="field-email">
          Email <span className="required" aria-hidden="true">*</span>
        </label>
        <input type="email" id="field-email" name="email" required autoComplete="email" />
      </div>

      <div className="form-field">
        <label htmlFor="field-phone">Phone</label>
        <input type="tel" id="field-phone" name="phone" placeholder="024 123 4567" autoComplete="tel" />
      </div>

      <div className="form-field">
        <label htmlFor="field-message">
          Message <span className="required" aria-hidden="true">*</span>
        </label>
        <textarea id="field-message" name="message" rows={5} required minLength={10} />
      </div>

      {state.error ? (
        <p className="form-field__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
