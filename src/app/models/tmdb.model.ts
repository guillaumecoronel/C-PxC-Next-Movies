export interface Backdrop {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface Logo {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface Poster {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface tmdbImages {
  id: number;
  backdrops: Backdrop[];
  logos: Logo[];
  posters: Poster[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any; // Peut être remplacé par un type si tu connais la structure
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string; // ou Date si tu veux convertir
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieVideoResponse {
  id: number;
  results: MovieVideo[];
}

export interface MovieVideo {
  iso_639_1: string;         // Langue ISO (ex: 'fr')
  iso_3166_1: string;        // Pays ISO (ex: 'FR')
  name: string;              // Nom complet de la vidéo
  key: string;               // ID vidéo YouTube ou clé selon la plateforme
  site: string;              // Plateforme (ex: 'YouTube')
  size: number;              // Qualité (ex: 1080)
  type: string;              // Type de vidéo (Trailer, Clip, Teaser…)
  official: boolean;         // Est-ce une vidéo officielle ?
  published_at: string;      // Date ISO de publication
  id: string;                // ID interne de la ressource
}
