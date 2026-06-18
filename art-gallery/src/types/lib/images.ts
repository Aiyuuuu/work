 import { IImage } from "../db/db";

 export type ImagesResult = {
   items: IImage[];
   startPage: number;
   pagesRequested: number;
   pagesReturned: number;
   pageSize: number;
   totalItems: number;
   totalPages: number;
   hasMore: boolean;
   nextStartPage: number | null;
 };