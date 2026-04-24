// components/forms/ContactForm.js
"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { sendEmail } from "@/actions/sendEmails";

export default function ContactForm() {
  // useActionState handles the server action lifecycle (React 19)
  const [state, formAction, isPending] = useActionState(sendEmail, null);

  return (
    <form action={formAction} className="space-y-6 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label
            htmlFor="firstName"
            className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            disabled={isPending}
            className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:opacity-50"
            placeholder="Jane"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="lastName"
            className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            disabled={isPending}
            className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:opacity-50"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="email"
          className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
          className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:opacity-50"
          placeholder="jane@example.com"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="subject"
          className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          disabled={isPending}
          className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:opacity-50"
          placeholder="How can we help you?"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="message"
          className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="6"
          required
          disabled={isPending}
          className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none disabled:opacity-50"
          placeholder="Write your message here..."></textarea>
      </div>

      {/* Success/Error Feedback */}
      {state && (
        <div
          className={`p-4 rounded-sm text-sm font-bold ${state.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center bg-black text-white font-bold px-8 py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors rounded-sm mt-4 group w-full md:w-auto self-start disabled:opacity-70 disabled:cursor-not-allowed">
        {isPending ? (
          <>
            Sending...
            <Loader2 className="ml-2 w-4 h-4 animate-spin" />
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
