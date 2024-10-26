Upload Images to Cloud

## Getting Started

First, run the development server:

```bash
make up

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


## S3

ファイル一覧表示する際に使用するポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSpecificIP",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::buckedname/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "xxx.xxx.x.xx/24"
        }
      }
    }
  ]
}
```
