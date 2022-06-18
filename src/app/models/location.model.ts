export interface LocationsResponse {
  info: Info;
  results: Location[];
}

interface Info {
  count: number;
  pages: number;
  next: string;
  prev: string | null;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}
