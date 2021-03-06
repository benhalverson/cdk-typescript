import { Template, Capture } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../lib/hitcounter";

test("DynamoDB Table created", () => {
  const stack = new cdk.Stack();

  // WHEN
  new HitCounter(stack, "HitCounter", {
    downstream: new lambda.Function(stack, "TestFunction", {
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
      runtime: lambda.Runtime.NODEJS_16_X,
    }),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResource("AWS::DynamoDB::Table", 1);
});
test('Lambda Has Environment Variables', () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream:  new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('lambda')
    })
  });
  // THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual(
    {
      Variables: {
        DOWNSTREAM_FUNCTION_NAME: {
          Ref: "TestFunction22AD90FC",
        },
        HITS_TABLE_NAME: {
          Ref: "MyTestConstructHits24A357F0",
        },
      },
    }
  );
});

test('DynamoDB Table created with encryption', () => {
  const stack = new cdk.Stack();

  // WHEN
  new HitCounter(stack, "HitCounter", {
    downstream: new lambda.Function(stack, "TestFunction", {
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
      runtime: lambda.Runtime.NODEJS_16_X,
    }),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    SSESpecification: {
      SSEEnabled: true,
    }
  });
});

test('read capacity can be configured', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new HitCounter(stack, "HitCounter", {
      downstream: new lambda.Function(stack, "TestFunction", {
        handler: "hello.handler",
        code: lambda.Code.fromAsset("lambda"),
        runtime: lambda.Runtime.NODEJS_16_X,
      }),
      readCapacity: 3,
  })
}).toThrowError(/readCapacity must be between 5 and 20/);
});