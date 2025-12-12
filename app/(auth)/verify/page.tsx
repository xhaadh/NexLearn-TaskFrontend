"use client";
import React, { useState } from "react";
import Frame from "../../../public/frame.png";
import Image from "next/image";
import NavIcon from "../../../public/OBJECTS.png";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtp } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const VerifyPage = () => {
  const params = useSearchParams();
  const mobile = params?.get("mobile") || "+917306398387";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!mobile || !otp) return alert("Provide mobile and OTP");
    setLoading(true);
    try {
      const res = await verifyOtp(mobile, otp);
      const data = res.data;
      if (data.login) {
        login(data.access_token, data.refresh_token, data.user ?? null);
        router.push("/"); 
      } else {
        router.push(`/create-profile?mobile=${encodeURIComponent(mobile)}`);
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.message || err?.message || "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="flex mx-auto justify-center items-center min-h-screen bg-black/50">
      <div className="relative hidden md:block">
        {/* Frame Image */}
        <Image src={Frame} alt="frame" width={650} />

        <form className="absolute top-[60%] right-0 -translate-y-1/2 w-[310px] h-[450px] bg-transparent p-6">
          <h1 className="text-lg font-semibold mb-2">
            Enter the code we texted you
          </h1>
          <p className="text-xs text-gray-700">
            We`ve sent an SMS to {mobile}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center bg-gray-200 px-3 rounded-md focus:outline-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="SMS Code"
                className="w-full px-1 py-2 outline-none no-spinner"
              />
            </div>
            <p className="text-xs text-gray-700">
              Your 6 didgit code is on its way. This can sometimes take a few
              moments
            </p>
            <button
              onClick={handleResendCode}
              className="text-xs font-bold underline text-slate-800 cursor-pointer hover:opacity-95"
            >
              Resend Code
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleVerify}
              className="mt-20 w-full bg-slate-800 text-white py-2 rounded-md cursor-pointer hover:opacity-95"
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

          <h1 className="text-lg font-semibold mb-2">
            Enter the code we texted you
          </h1>
          <p className="text-xs text-gray-700 mb-2">We`ve sent an SMS to {mobile}</p>

          <form className="space-y-3">
            <div className="flex items-center bg-gray-200 px-3 rounded-md focus:outline-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="SMS Code"
                className="w-full px-1 py-2 outline-none no-spinner"
              />
            </div>
            <p className="text-xs text-gray-700">
              Your 6 didgit code is on its way. This can sometimes take a few
              moments
            </p>
            <button className="text-xs font-bold underline text-slate-800 cursor-pointer hover:opacity-95">
              Resend Code
            </button>

            <button
              type="submit"
              disabled={loading}
              onClick={handleVerify}
              className="mt-2 w-full bg-slate-800 text-white py-3 rounded-md cursor-pointer hover:opacity-95"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
