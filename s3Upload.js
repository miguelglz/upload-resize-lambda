class S3Upload {
  constructor(AWS) {
    this.s3 = new AWS.S3();
  }
  
  upload(Body, fileName, folder, isPublic) {
    if (!Body) throw new Error('A body must be provided');
    folder = folder && folder.slice(-1) !== '/' ? `${folder}/` : null;

    const params = {
      Body, 
      Bucket: 'tdspictures', 
      Key: folder+fileName
    }

    if(isPublic) params.ACL = 'public-read';

    return new Promise((resolve, reject) => {
      console.log('uploading file...');
      this.s3.putObject(params, function(error, data) {
        if (error) reject(error);
        resolve(data);
      });
    });
  }
}
module.exports = S3Upload;