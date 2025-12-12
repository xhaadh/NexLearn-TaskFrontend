"use client";
import React, { useState, useRef } from "react";
import Frame from "../../../public/frame.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavIcon from "../../../public/OBJECTS.png";
import { createProfile } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (jpg, png, webp...).");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (
      !mobile.trim() ||
      !name.trim() ||
      !email.trim() ||
      !qualification.trim() ||
      !file
    ) {
      setError("Please fill all required fields and attach a profile image.");
      return;
    }

    setLoading(true);
    const fullMobile = mobile.startsWith("+91") ? mobile : `+91${mobile}`;

    try {
  const res = await createProfile({
    mobile: fullMobile,
    name,
    email,
    qualification,
    profile_image: file,
  });

  const data = res?.data ?? res;

  if (!data || data.success === false) {
    setError(data?.message || "Submission failed");
    return;
  }

  if (!data.access_token || !data.refresh_token) {
    setError("Server did not return authentication tokens.");
    return;
  }

  login(data.access_token, data.refresh_token, data.user ?? null);
  router.push("/");
} catch (err: any) {
  setError(err?.response?.data?.message || err?.message || "Submission failed");
} finally {
  setLoading(false);
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="relative hidden md:block">
        <Image src={Frame} alt="frame" width={650} priority />

        <form onSubmit={handleSubmit}>
          <div
            className="
            absolute 
            top-[48%] 
            right-[32px] 
            -translate-y-1/2 
            w-[260px] 
            max-h-[47vh] 
            overflow-y-auto 
            overflow-x-hidden
            p-4
            pb-14
          "
          >
            <h2 className="text-xl font-semibold mb-2 text-slate-900">
              Add Your Details
            </h2>

            {/* Profile Image */}
            <div className="mb-2">
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Profile picture *
                </label>

                <label
                  htmlFor="profile_upload"
                  className="group relative flex items-center justify-center w-22 h-22 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer overflow-hidden"
                >
                  {!preview ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        className="opacity-90"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                      width={50}
                      height={50}
                    />
                  )}

                  <input
                    id="profile_upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border rounded-md px-2 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border rounded-md px-2 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Mobile *
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border rounded-md px-2 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Qualification *
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="Your qualification"
                  className="w-full border rounded-md px-2 py-2 text-xs"
                  required
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="absolute bottom-5 right-[62px] w-[215px] bg-slate-900 text-white py-2 rounded-md text-xs z-30 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Get Started"}
          </button>
        </form>
      </div>
      {/* ========= MOBILE VIEW ========= */}
      <div className="block md:hidden w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 max-h-[85vh] relative">
          {/* header */}
          <div className="mb-6 flex flex-col gap-3">
            <Image src={NavIcon} alt="icon" width={150} />
            <h2 className="text-lg font-semibold leading-5">
              Add Your Details
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 overflow-y-auto max-h-[62vh] pb-20">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Profile picture *
                </label>

                <label
                  htmlFor="profile_upload"
                  className="group relative flex items-center justify-center w-full h-36 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer overflow-hidden"
                >
                  {!preview ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        className="opacity-90"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs">
                        Tap to upload or drag & drop
                      </span>
                      <span className="text-[11px] text-slate-400">
                        JPG, PNG, WEBP • max 2MB
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                      width={50}
                      height={50}
                    />
                  )}

                  <input
                    id="profile_upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Inputs */}
              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-gray-50 border border-slate-200 rounded-lg px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-50 border border-slate-200 rounded-lg px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full bg-gray-50 border border-slate-200 rounded-lg px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">
                  Qualification *
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="Your qualification"
                  className="w-full bg-gray-50 border border-slate-200 rounded-lg px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="absolute left-6 right-6 bottom-4 bg-slate-800 text-white py-3 rounded-lg text-sm font-medium shadow-md disabled:opacity-60 z-40"
            >
              {loading ? "Submitting..." : "Get Started"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
