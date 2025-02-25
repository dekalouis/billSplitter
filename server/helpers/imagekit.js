// const ImageKit = require("imagekit");

// const imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

// module.exports = imagekit;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const ImageKit = require("imagekit");

// console.log("IMAGEKIT_PUBLIC_KEY:", process.env.IMAGEKIT_PUBLIC_KEY);
// console.log("IMAGEKIT_PRIVATE_KEY:", process.env.IMAGEKIT_PRIVATE_KEY);
// console.log("IMAGEKIT_URL_ENDPOINT:", process.env.IMAGEKIT_URL_ENDPOINT);

let imagekit;

if (process.env.NODE_ENV === "test") {
  imagekit = {
    upload: async () => {
      return {
        url: "http://fake-test-url.com/mock.jpg",
      };
    },
  };
} else {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

module.exports = imagekit;
