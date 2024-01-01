import axios from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = "GET_PLAN_1";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchGetPlan1 = async () => {
  try {
    const { data } = await api.get(`/api/plan1`);
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function usePlan1() {
  return useQuery(QUERY_KEY, () => fetchGetPlan1());
}
