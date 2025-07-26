import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/agencies`;

export const getAgencies = () => axios.get(API);
export const createAgency = (data) => axios.post(API, data);
export const updateAgency = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteAgency = (id) => axios.delete(`${API}/${id}`);
