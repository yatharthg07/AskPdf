import AWS from "aws-sdk";
import { param } from "drizzle-orm";
import { Key } from "lucide-react";

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
      params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME },
      region: "ap-south-1",
    });
    const file_key =
    "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: file_key,
        Body: file,
    }
    const upload = await s3.putObject(params).on("httpUploadProgress", evt=>
        {
            console.log(evt.loaded, evt.total);
        }).promise()

    const data = await upload;
    console.log(data);

    return Promise.resolve({
        file_key,
        file_name: file.name,   
    })

  } catch (e) {
    console.log(e);
  }
}

export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
    return url;
  }