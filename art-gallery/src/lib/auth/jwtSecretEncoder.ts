
if(!process.env.JWT_ACCESS_SECRET){
    throw new Error ("Please define \"JWT_ACCESS_SECRET\" in environment variables");
}

if(!process.env.JWT_REFRESH_SECRET){
    throw new Error ("Please define \"JWT_REFRESH_SECRET\" in environment variables");
}

export const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!
);

export const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!
);

