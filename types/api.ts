import { ApiStatus } from "./common";
import { SeoData } from "./seo";
import { MapLinksData } from "./map";
import { ScrapeData } from "./scrape";


export type ScoreResponse = SeoData & { status: ApiStatus };

export interface MapResponse {
  status: ApiStatus;
  links: MapLinksData[];
}

export type ScrapeResponse = ScrapeData & { status: ApiStatus };

export interface ChatResponse {
  status: ApiStatus;
  bot_reply: string;
}
