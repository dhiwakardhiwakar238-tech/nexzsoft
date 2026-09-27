import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { s3Client, storageConfig } from "../../config/filebase.storage.config.js";


// Method to upload the document in file base s3
const uploadDocument = async (file, key) => {
  const command = new PutObjectCommand({
    Bucket: storageConfig.bucketName,
    Key: key,
   Body: file.buffer,
        ContentType: file.mimetype  
  });

  return await s3Client.send(command);
};


// method to delete the documnt from the file base

const deleteDocument = async(key) =>{

  const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key
    }
  );
  
  await s3Client.send(command);

};


export default{
  uploadDocument,
  deleteDocument
}