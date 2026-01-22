# Deployment Guide

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## AWS Lambda Deployment Options

### Option 1: AWS Amplify (Recommended - Easiest)

AWS Amplify provides native Next.js support:

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git repository (GitHub, GitLab, Bitbucket)

2. **Configure Build**
   - Amplify auto-detects Next.js
   - Build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

3. **Deploy**
   - Amplify handles deployment automatically
   - Updates on every push to main branch

### Option 2: Serverless Framework

1. **Install Dependencies**
   ```bash
   npm install -g serverless
   ```

2. **Configure AWS Credentials**
   ```bash
   aws configure
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   serverless deploy
   ```

### Option 3: AWS CDK

1. **Install CDK**
   ```bash
   npm install -g aws-cdk
   cd infrastructure
   npm install
   ```

2. **Bootstrap CDK** (first time only)
   ```bash
   cdk bootstrap
   ```

3. **Deploy**
   ```bash
   cd ..
   npm run build
   cd infrastructure
   cdk deploy
   ```

### Option 4: AWS SAM (Serverless Application Model)

Create `template.yaml`:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  NextjsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: nodejs20.x
      Handler: serverless-handler.handler
      CodeUri: .next/standalone
      MemorySize: 1024
      Timeout: 30
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /{proxy+}
            Method: ANY
```

Deploy:
```bash
sam build
sam deploy --guided
```

## Environment Variables

Set these in your deployment platform:

- `NODE_ENV=production`
- (Add any API keys or secrets here)

## Cost Optimization Tips

1. **Use CloudFront CDN** - Cache static assets
2. **Enable Lambda Provisioned Concurrency** only if needed
3. **Use S3 for static assets** - Cheaper than Lambda
4. **Monitor CloudWatch** - Set up billing alerts
5. **Use AWS Free Tier** - 1M Lambda requests/month free

## Monitoring

- **CloudWatch Logs** - View Lambda function logs
- **CloudWatch Metrics** - Monitor invocations, errors, duration
- **AWS X-Ray** - Trace requests (optional)

## Troubleshooting

### Build Errors
- Ensure Node.js 20.x is installed
- Clear `.next` folder and rebuild
- Check `package.json` dependencies

### Deployment Errors
- Verify AWS credentials are configured
- Check IAM permissions for Lambda/API Gateway
- Review CloudWatch logs for runtime errors

### Performance Issues
- Enable CloudFront caching
- Optimize images (already done with Next.js Image)
- Consider Lambda@Edge for edge computing
