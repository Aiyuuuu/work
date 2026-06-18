 import { connectDb } from "@/lib/db/db";
 import { Image } from "@/lib/db/models";
 import { PAGE_SIZE } from "@/constants/imageConstants";
 import { ImagesResult } from "@/types/lib/images";
 
 export async function getImages(
   startPage = 1,
   pages = 1
 ): Promise<ImagesResult> {
   await connectDb();
 
   // Keep page values safe
   const safeStartPage = Math.max(1, Math.floor(startPage));
   const safePages = Math.max(1, Math.floor(pages));
 
   // Convert page values into Mongo skip/limit values
   const skip = (safeStartPage - 1) * PAGE_SIZE;
   const limit = safePages * PAGE_SIZE;
 
   const [items, totalItems] = await Promise.all([
     Image.find({})
       // Stable sort so pagination does not jump around
       .sort({ createdAt: -1, _id: -1 })
       .skip(skip)
       .limit(limit)
       .lean(),
     Image.countDocuments({}),
   ]);
 
   const totalPages = Math.ceil(totalItems / PAGE_SIZE);
   const pagesReturned = Math.ceil(items.length / PAGE_SIZE);
 
   // Find the next page number, if there is one
   const nextStartPage =
     safeStartPage + pagesReturned <= totalPages
       ? safeStartPage + pagesReturned
       : null;
 
   return {
     items, 
     startPage: safeStartPage,
     pagesRequested: safePages,
     pagesReturned,
     pageSize: PAGE_SIZE,
     totalItems,
     totalPages,
     hasMore: nextStartPage !== null,
     nextStartPage,
   };
 }