import axios from "axios";
import { API_URL } from "../config";

export const fetchContracts = () => axios.get(`${API_URL}/contracts`);

export const createContract = (data) => axios.post(`${API_URL}/contracts`, data);

export const updateContract = (id, data) =>
  axios.put(`${API_URL}/contracts/${id}`, data);

export const deleteContract = (id) =>
  axios.delete(`${API_URL}/contracts/${id}`);

export const fetchContractsSummary = (params) =>
  axios.get(`${API_URL}/contracts/summary`, { params });
