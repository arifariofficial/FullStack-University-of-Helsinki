import axios from "axios";
import { Dairy, NewDiary } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getDiaries = async () => {
  const { data } = await axios.get<Dairy[]>(baseUrl);

  return data;
};

const createNote = async (object: NewDiary) => {
  const { data } = await axios.post<Dairy>(baseUrl, object);
  return data;
};

export default {
  getDiaries,
  createNote,
};
