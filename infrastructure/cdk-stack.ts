import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import * as cdk_aws_cloudfront from 'aws-cdk-lib/aws-cloudfront';

export class FightingMonkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for static assets
    const assetsBucket = new s3.Bucket(this, 'AssetsBucket', {
      bucketName: `fightingmonk-assets-${this.account}`,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function for Next.js
    const nextjsFunction = new lambda.Function(this, 'NextjsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'serverless-handler.handler',
      code: lambda.Code.fromAsset('../.next/standalone'),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production',
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'FightingMonkApi', {
      restApiName: 'Fighting Monk API',
      description: 'API for Fighting Monk Next.js application',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Lambda integration
    const lambdaIntegration = new apigateway.LambdaIntegration(nextjsFunction);
    api.root.addProxy({
      defaultIntegration: lambdaIntegration,
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.RestApiOrigin(api),
        allowedMethods: cdk_aws_cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: '/',
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });
  }
}
