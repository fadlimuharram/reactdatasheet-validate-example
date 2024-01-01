import axios from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = "GET_INSURANCE";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchInsurance = async () => {
  try {
    const { data } = await api.get(`/api/insurance`);
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function useInsurance() {
  return useQuery(QUERY_KEY, () => fetchInsurance());
}
