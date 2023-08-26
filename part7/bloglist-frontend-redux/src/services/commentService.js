import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async (id) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.get(`${baseUrl}/${id}/comments`, config);
  return response.data;
};

const createComment = async (id, comment) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    comment,
    config
  );

  return response.data;
};

export default { setToken, getAll, createComment };
