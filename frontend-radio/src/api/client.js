import axios from "axios";
const API = process.env.REACT_APP_API_URL + "/clients";

export const getClients = () => axios.get(API);
export const createClient = (data) => axios.post(API, data);
export const updateClient = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteClient = (id) => axios.delete(`${API}/${id}`);
