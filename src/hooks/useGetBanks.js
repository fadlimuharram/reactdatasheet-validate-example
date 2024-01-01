import axios from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = "GET_BANKS";

const api = axios.create({
  baseURL: "",
});

const fetchGetBank = async () => {
  try {
    const { data } = await api.get(`/api/bank`);
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function useGetBankLists() {
  return useQuery(QUERY_KEY, () => fetchGetBank());
}
