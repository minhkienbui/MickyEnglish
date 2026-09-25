import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials are present
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadAudioBuffer(
  buffer: Buffer,
  folder: string = 'micky-english-audio'
): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // Fallback data URI for local/demo mode
    const base64Audio = buffer.toString('base64');
    return `data:audio/mp3;base64,${base64Audio}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Cloudinary handles audio files under video resource_type
        folder,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload audio failed'));
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}
