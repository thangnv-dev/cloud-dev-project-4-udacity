import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const S3BucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION) || 300

export class AttachmentUtils {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = S3BucketName
  ) {}

  // get Attachment Url
  getAttachmentUrl(todoId: string) {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }

  // get Upload Url
  getUploadUrl(todoId: string) {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: urlExpiration
    })

    return uploadUrl as string
  }
}
