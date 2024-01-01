import axios from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = "GET_ITEMS";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchGetItems = async (provider) => {
  try {
    const { data } = await api.get(`/api/items?provider=${provider}`);
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function useGetItems(provider, options) {
  return useQuery(
    [QUERY_KEY, provider],
    () => fetchGetItems(provider),
    {
      ...options,
    }
  );
}
