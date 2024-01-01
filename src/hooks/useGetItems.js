import axios from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = "GET_ITEMS";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchGetItems = async () => {
  try {
    const { data } = await api.get(`/api/items`);
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function useGetItems() {
  return useQuery(QUERY_KEY, () => fetchGetItems());
}
