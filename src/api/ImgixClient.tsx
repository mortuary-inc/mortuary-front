// import ImgixClient from '@imgix/js-core';
// export default new ImgixClient({
//   domain: 'imgix.net',
// });

class ImgixClient {
  buildURL(image: string, data: any) {
    return image;
  }
}

export default new ImgixClient();
