import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  endpoint: process.env.FILEBASE_ENDPOINT,
  region: process.env.FILEBASE_REGION,
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID,
    secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY,
  },
});

export const storageConfig = {
  bucketName: process.env.FILEBASE_BUCKET_NAME,
};