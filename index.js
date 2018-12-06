const AWS = require('aws-sdk');
const fileType = require('file-type');
const sha1 = require('sha1');
const sharp = require('sharp');
const S3Upload = require('./s3Upload');
const ImageResizer = require('./resizer');

exports.handler = function(event, context, callback) {
	const request = event.body;
	const base64String = request.base64String;
	const buffer = new Buffer(base64String, 'base64');
	const fileMime = fileType(buffer);

	console.log('if filemime...');

	if (fileMime === null) callback({"error" : "The string suppplied is not a file type"});

	const fileExt = fileMime.ext;
	const randomFolderName = sha1(new Buffer(new Date().toString()));
	const thumbName = `thumb_128x128.${fileExt}`;
	const originalName = `original.${fileExt}`;

	const resizer = new ImageResizer(sharp);
	const originalUpload = new S3Upload(AWS);
	const thumbnailUpload = new S3Upload(AWS);

	const size = {
		w: 128,
		h: 128,
	};

	async function resizeAndUpload() {
		try {
			thumbImage = await resizer.resize(base64String, size);
			thumb = await thumbnailUpload.upload(thumbImage, thumbName, randomFolderName, true);
			original = await originalUpload.upload(buffer, originalName, randomFolderName, true);
			callback(null, {
				original: `${randomFolderName}/${originalName}`,
				thumb: `${randomFolderName}/${thumbName}`
			});
		}catch (err){
			callback(err);
		}
	}

	resizeAndUpload();
}