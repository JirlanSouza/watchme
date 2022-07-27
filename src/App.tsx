import { useCallback, useEffect, useState } from "react";

import { SideBar } from "./components/SideBar";
import { Content } from "./components/Content";

import { api } from "./services/api";

import "./styles/global.scss";

import "./styles/sidebar.scss";
import "./styles/content.scss";

interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  useEffect(() => {
    api.get<GenreResponseProps[]>("genres").then((response) => {
      const currentSelectedGenre = response.data?.find(
        (genre) => genre.id === selectedGenreId
      ) as GenreResponseProps;

      setGenres(response.data);
      setSelectedGenre(currentSelectedGenre);
    });

    handleSelectedGenreId(selectedGenreId);
  }, []);

  const handleSelectedGenreId = (genreId: number) => {
    if (genreId === selectedGenreId) return;

    setSelectedGenreId(genreId);
    api.get<MovieProps[]>(`movies/?Genre_id=${genreId}`).then((response) => {
      setMovies(response.data);
    });

    const currentSelectedGenre = genres.find(
      (genre) => genre.id === genreId
    ) as GenreResponseProps;
    setSelectedGenre(currentSelectedGenre);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        getSelectedGenreId={handleSelectedGenreId}
      />
      <Content selectedGenre={selectedGenre} movies={movies} />
    </div>
  );
}
