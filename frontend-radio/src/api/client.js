import axios from "axios";
import { API_URL } from "../config";

const RESOURCE = `${API_URL}/clients`;

export const getClients = () => axios.get(RESOURCE);
export const createClient = (data) => axios.post(RESOURCE, data);
export const updateClient = (id, data) => axios.put(`${RESOURCE}/${id}`, data);
export const deleteClient = (id) => axios.delete(`${RESOURCE}/${id}`);
