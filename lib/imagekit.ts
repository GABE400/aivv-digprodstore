import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_placeholder",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_placeholder",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/aivvstore",
});
