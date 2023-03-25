import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then((response) => response.data);
};
const create = (newObj) => {
  const req = axios.post(baseUrl, newObj);
  return req.then((response) => response.data);
};
const update = (id, newObj) => {
  const req = axios.put(`${baseUrl}/${id}`, newObj);
  return req.then((response) => response.data);
};
const deletePerson = (id) => {
  const req = axios.delete(`${baseUrl}/${id}`);
  return req.then((response) => response.data);
};
// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, deletePerson };
