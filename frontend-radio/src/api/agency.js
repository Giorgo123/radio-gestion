import axios from "axios";
import { API_URL } from "../config";

const RESOURCE = `${API_URL}/agencies`;

export const getAgencies = () => axios.get(RESOURCE);
export const createAgency = (data) => axios.post(RESOURCE, data);
export const updateAgency = (id, data) =>
  axios.put(`${RESOURCE}/${id}`, data);
export const deleteAgency = (id) => axios.delete(`${RESOURCE}/${id}`);
