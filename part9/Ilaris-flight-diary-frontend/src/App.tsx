import React, { useEffect, useState } from "react";
import noteService from "./services/noteService";
import { Dairy, NewDiary, Visibility, Weather } from "./types";
import axios from "axios";

const DiaryList = ({ diary }: { diary: Dairy }) => {
  return (
    <div>
      <b>{diary.date}</b>
      <p>visibility: {diary.visibility}</p>
      <p>weather: {diary.weather}</p>
    </div>
  );
};

interface VisibilityOption {
  value: Visibility;
  label: string;
}

const visibilityOptions: VisibilityOption[] = Object.values(Visibility).map((item) => ({
  value: item,
  label: item.toString(),
}));

interface WeatherOption {
  value: Weather;
  label: string;
}

const weatherOptions: WeatherOption[] = Object.values(Weather).map((item) => ({
  value: item,
  label: item.toString(),
}));

function App() {
  const [diaries, setDiaries] = useState<Dairy[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchDiaries = async () => {
      const dairies = await noteService.getDiaries();
      setDiaries(dairies);
    };
    void fetchDiaries();
  }, []);

  const onVisibilityChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (typeof event.target.value === "string") {
      const value = event.target.value;

      const visibility = Object.values(Visibility).find((item) => item.toString() === value);
      if (visibility) {
        setVisibility(visibility);
      }
    }
  };

  const onWeatherChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (typeof event.target.value === "string") {
      const value = event.target.value;

      const weather = Object.values(Weather).find((item) => item.toString() === value);
      if (weather) {
        setWeather(weather);
      }
    }
  };

  const createDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const noteObj: NewDiary = {
      date: date,
      visibility: visibility,
      weather: weather,
      comment: comment,
    };

    try {
      const newDiary = await noteService.createNote(noteObj);
      setDiaries(diaries.concat(newDiary));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data && typeof error?.response?.data === "string") {
          const message = error?.response?.data;
          setNotification(message);
        } else {
          setNotification("Unknown axios error");
        }
      } else {
        setNotification("Unknown error");
      }
    }
  };

  return (
    <div>
      <div>
        <h3>Add a new entry</h3>
        {noteService && <div style={{ color: "red" }}>{notification}</div>}
        <form onSubmit={createDiary}>
          date <input type="date" value={date} onChange={({ target }) => setDate(target.value)} />
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            visibility
            <div
              style={{
                paddingLeft: "15px",
              }}
            >
              {visibilityOptions.map((item) => (
                <label key={item.value}>
                  {item.label}
                  <input
                    type="radio"
                    name={visibility}
                    checked={item.value === visibility}
                    value={item.value}
                    onChange={onVisibilityChange}
                  />
                </label>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            weather
            <div
              style={{
                paddingLeft: "15px",
              }}
            >
              {weatherOptions.map((item) => (
                <label key={item.value}>
                  {item.label}
                  <input
                    type="radio"
                    value={item.value}
                    checked={item.value === weather}
                    name={weather}
                    onChange={onWeatherChange}
                  />
                </label>
              ))}
            </div>
          </div>
          comment
          <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} />
          <br />
          <button type="submit">add</button>
        </form>
      </div>
      <div>
        <h3>Diary entries</h3>
        {diaries.map((diary) => (
          <DiaryList key={diary.id} diary={diary} />
        ))}
      </div>
    </div>
  );
}

export default App;
