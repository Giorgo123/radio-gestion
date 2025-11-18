import axios from "axios";
import { API_URL } from "../config";

const RESOURCE = `${API_URL}/transactions`;

export const getTransactions = () => axios.get(RESOURCE);
export const createTransaction = (data) => axios.post(RESOURCE, data);
export const updateTransaction = (id, data) =>
  axios.put(`${RESOURCE}/${id}`, data);
export const deleteTransaction = (id) =>
  axios.delete(`${RESOURCE}/${id}`);
