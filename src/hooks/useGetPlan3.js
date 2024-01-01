import axios from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = "GET_PLAN_3";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchGetPlan3 = async () => {
  try {
    const { data } = await api.get(`/api/plan3`);
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function usePlan3() {
  return useQuery(QUERY_KEY, () => fetchGetPlan3());

}
