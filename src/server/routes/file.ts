import z from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const bucket = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const endpoint = `https://s3.${region}.amazonaws.com/${bucket}`;

export const fileRoutes = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const isoString = date.toISOString();
      const dateString = isoString.split("T")[0];

      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${dateString}/${input.filename.replaceAll(" ", "_")}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };

      const s3Client = new S3Client({
        endpoint: endpoint,
        region: region,
        credentials: {
          accessKeyId: "",
          secretAccessKey: "",
          sessionToken: "",
        },
      });

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      });

      return {
        url,
        method: "PUT" as const,
      };
    }),
});
