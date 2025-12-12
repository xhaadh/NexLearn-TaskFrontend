import api from "./axios";

export const sendOtp = (mobile: string) => {
  const fd = new FormData();
  fd.append("mobile", mobile);
  console.log("Sending OTP to:", mobile);
  return api.post("/auth/send-otp", fd)
};

export const verifyOtp = (mobile: string, otp: string) => {
  const fd = new FormData();
  fd.append("mobile", mobile);
  fd.append("otp", otp);
  return api.post("/auth/verify-otp", fd)
};

export const createProfile = (payload: {
  mobile: string;
  name: string;
  email: string;
  qualification: string;
  profile_image?: File | null;
}) => {
  const fd = new FormData();
  fd.append("mobile", payload.mobile);
  fd.append("name", payload.name);
  fd.append("email", payload.email);
  fd.append("qualification", payload.qualification);
  if (payload.profile_image) fd.append("profile_image", payload.profile_image);
  return api.post("/auth/create-profile", fd)
};

export const listQuestions = () =>
  api
    .get("/question/list")
    .then((res) => {
      const d = res.data;
      if (Array.isArray(d)) {
        return { data: { questions: d } };
      }
      if (d?.questions || d?.data?.questions) {
        const questions = d.questions ?? d.data?.questions;
        const total_time = d.total_time ?? d.data?.total_time ?? d.time;
        return { data: { questions, total_time, ...d } };
      }
      return res;
    })
    .catch((err) => {
      console.error("[listQuestions] error:", err);
      throw err;
    });

export const submitAnswers = (
  answers: { question_id: number; selected_option_id: number | null }[]
) => {
  const fd = new FormData();
  fd.append("answers", JSON.stringify(answers));
  return api.post("/answers/submit", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
