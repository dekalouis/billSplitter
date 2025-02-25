// const ImageKit = require("imagekit");

// const imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

// module.exports = imagekit;

const ImageKit = require("imagekit");

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
