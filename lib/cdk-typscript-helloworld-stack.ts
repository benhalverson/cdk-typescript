import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';


export class CdkTypscriptHelloworldStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //define the lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,  //execution environment
      code: lambda.Code.fromAsset('lambda'), //code from the lambda directory
      handler: 'hello.handler' //file is "hello" and function is "handler"
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    //define an API Gateway REST API backed by our "hello" lambda function
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    });

    new apigw.LambdaRestApi(this, 'EndpointWithCounter', {
      handler: helloWithCounter.handler
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: 'path'
    })
  }
}
