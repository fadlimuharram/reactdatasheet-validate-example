import axios from "axios";
import { useMutation } from "react-query";

const QUERY_KEY = "VALIDATE_BY_DATA";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchValdateData = async (body) => {
  try {
    const { data } = await api.post(`/api/validate`, {
      body
    });
    return data;
  } catch (err) {
    throw new Error();
  }
};

export function useValidateData() {
  return useMutation((payload) => fetchValdateData(payload));
}
