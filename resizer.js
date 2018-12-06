class ImageResizer {
  constructor(Sharp) {
    this.sharp = Sharp;
  }
  
  resize(base64String, size) {
    if (!base64String) throw new Error('A base64String must be specified');
    if (!size) throw new Error('Image size must be specified');
    console.log('resizing...');
    return new Promise((resolve, reject) => {
      this.sharp(Buffer.from(base64String, 'base64'))
        .resize(size.w, size.h, {fit: 'fill'})
        .toBuffer()
        .then(data => {
          console.log('returning resized image...');
          return resolve(data);
        })
        .catch(err => reject(err))
    });
  }
}
module.exports = ImageResizer;