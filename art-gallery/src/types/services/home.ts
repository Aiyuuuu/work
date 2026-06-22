import { IStats, IMeta } from "@/types/db/db";


export type SingleImage = {
  _id: string;
  externalId: number;
  url: string;
  hash: string;
  blurDataUrl: string;
  baseModel: string;
  browsingLevel: number;
  width: number;
  height: number;
  type: string;
  createdAt: Date | null;
  username: string;
  stats: IStats;
  meta: IMeta | null;
};


export type HomeImagesResult = {
  items: SingleImage[];
  startPage: number;
  pagesRequested: number;
  pagesReturned: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
  nextStartPage: number | null;
};