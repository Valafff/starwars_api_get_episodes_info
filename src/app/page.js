"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Home() {

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const starWarsUrl = "https://swapi.dev/api/films";

  // функция загрузки данных
  const loadEpisodes = async () => {
    try {
      const response = await axios.get(starWarsUrl);
      setEpisodes(response.data.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных рендеринге страницы
  useEffect(() => {
    loadEpisodes();
  }, []);

  // Обработчик клика по эпизоду показываем/скрываем подробные данные. ... - копируются все свойства текущего объекта
  const episodeClick = (id) => {
    const updatedEpisodes = episodes.map((episode) => {
      if (episode.episode_id === id) {

        return { ...episode, showAllInfo: !episode.showAllInfo };
      }
      return { ...episode, showAllInfo: false };
    });
    setEpisodes(updatedEpisodes);
  };

  if (error) {
    return <div style={{ padding: "20px", backgroundImage: "url('/assets/error.jpg')", minHeight: "100vh" }} className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <>
      <title>StarWars</title>

      <div style={{ padding: "20px", backgroundImage: "url('/assets/background.jpg')", minHeight: "100vh" }}>
        <h1 className={styles.mainHeader}>Star Wars React Next.js AJAX Client</h1>

        {loading ? (
          <div className={styles.spinner_loading}>
            <div className={styles.spinner}></div> {/* Спиннер */}
          </div>
        ) : (
          <div className={styles.episodes}>
            <title>StarWars</title>
            {episodes.map((episode) => (
              <div key={episode.episode_id} className={styles.episode}>
                <div
                  className={styles.episodeHeader}
                  onClick={() => episodeClick(episode.episode_id)}
                >
                  <h2 className={styles.episodeTitle}>{episode.title}</h2>
                  <h3 className={styles.episodeInfo}>
                    Episode {episode.episode_id}, {new Date(episode.release_date).getFullYear()}
                  </h3>
                </div>
                {episode.showAllInfo && (
                  <div className={styles.showAllInfo}>
                    {episode.opening_crawl.replaceAll("\r\n", " ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}