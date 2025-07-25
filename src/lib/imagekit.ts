import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMGKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMGKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMGKIT_ENDPOINT as string,
});

export default imagekit;