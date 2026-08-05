import { memberApi } from "./axiosInstance";

export const generateAIDietPlan = async (uid, dietPreference, weight) => {
  const res = await memberApi.post("/subscription/generate-diet-plan", { uid, dietPreference, weight });
  return res.data.dietPlan;
};