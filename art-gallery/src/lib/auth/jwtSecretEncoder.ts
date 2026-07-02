
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if(!accessSecret){
    throw new Error ("Please define \"JWT_ACCESS_SECRET\" in environment variables");
}

if(!refreshSecret){
    throw new Error ("Please define \"JWT_REFRESH_SECRET\" in environment variables");
}

/* TextEncoder().encode() converts string to bytes (Uint8Array) using UTF-8 encoding 
   because jose library expects secret key as binary data */
export const JWT_ACCESS_SECRET = new TextEncoder().encode(accessSecret);

export const JWT_REFRESH_SECRET = new TextEncoder().encode(refreshSecret);

