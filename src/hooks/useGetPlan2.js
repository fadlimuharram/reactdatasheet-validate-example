import axios from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = "GET_PLAN_2";

const api = axios.create({
  baseURL: "",
});

const fetchGetPlan2 = async () => {
  try {
    const { data } = await api.get(`/api/plan2`);
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function usePlan2() {
  return useQuery(QUERY_KEY, () => fetchGetPlan2());
}
