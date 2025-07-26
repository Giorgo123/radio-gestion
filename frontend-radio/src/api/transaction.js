import axios from "axios";
const API = process.env.REACT_APP_API_URL + "/transactions";

export const getTransactions = () => axios.get(API);
export const createTransaction = (data) => axios.post(API, data);
export const updateTransaction = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTransaction = (id) => axios.delete(`${API}/${id}`);
