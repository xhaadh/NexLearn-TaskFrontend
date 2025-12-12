"use client";
import React, { useState } from "react";
import Frame from "../../../public/frame.png";
import IND from "../../../public/india.png";
import Image from "next/image";
import NavIcon from "../../../public/OBJECTS.png";
import { sendOtp } from "@/lib/api";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!mobile?.trim()) return alert("Enter phone");
    if (!/^\d{10}$/.test(mobile)) return alert("Enter valid 10-digit number");

    const fullMobile = `+91${mobile}`;

    setLoading(true);
    try {
      await sendOtp(fullMobile);
      router.push(`/verify?mobile=${encodeURIComponent(fullMobile)}`);
    } catch (err: any) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex mx-auto justify-center items-center min-h-screen bg-black/50">
      <div className="relative hidden md:block">
        {/* Frame Image */}
        <Image src={Frame} alt="frame" width={650} />
        <form
          onSubmit={handleSubmit}
          className="absolute top-[60%] right-0 -translate-y-1/2 w-[310px] h-[450px] bg-transparent p-6"
        >
          <h1 className="text-lg font-semibold mb-2">
            Enter your phone number
          </h1>
          <p className="text-xs text-gray-700">
            We use your mobile number to identify your account
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center bg-gray-200 px-3 rounded-md focus:outline-2">
              <Image src={IND} className="w-3 h-3" alt="ind-icon" />
              <p className="pl-2 text-gray-500">+91</p>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="tel"
                placeholder="Phone number"
                className="w-full px-1 py-2 outline-none no-spinner"
              />
            </div>
            <p className="text-xs text-gray-700">
              By tapping Get Started, You agree to the Terms and Conditions
            </p>
            <button
              type="submit"
              disabled={loading}
              className="mt-26 w-full bg-slate-800 text-white py-2 rounded-md cursor-pointer hover:opacity-95"
            >
              {loading ? "Sending..." : "Get Started"}
            </button>
          </div>
        </form>
      </div>
      {/* ====== Mobile layout ====== */}
      <div className="block md:hidden w-full max-w-md px-4">
        <div className="bg-white/95 rounded-xl shadow-lg p-6">
          <div className="mb-4 flex items-center gap-3">
            <Image src={NavIcon} alt="icon" width={150} />
          </div>

          <h1 className="text-xl font-semibold mb-2">
            Enter your phone number
          </h1>
          <p className="text-xs text-gray-700 mb-2">
            We use your mobile number to identify your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center bg-gray-200 px-3 rounded-md focus:outline-2">
              <Image src={IND} className="w-3 h-3" alt="ind-icon" />
              <p className="pl-2 text-gray-500">+91</p>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="tel"
                placeholder="Phone number"
                className="w-full px-1 py-2 outline-none no-spinner"
              />
            </div>
            <p className="text-xs text-gray-700">
              By tapping Get Started, You agree to the Terms and Conditions
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-26 w-full bg-slate-800 text-white py-2 rounded-md cursor-pointer hover:opacity-95"
            >
              {loading ? "Sending..." : "Get Started"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
