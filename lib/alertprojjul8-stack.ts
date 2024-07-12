import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";

import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Alertprojjul8Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let topic = new sns.Topic(this, "alertjul8");

    let emailsub = new subscriptions.EmailSubscription("s.p.aditya@gmail.com");
    topic.addSubscription(emailsub);

    let lam = new lambda.Function(this, "publishobjectmsg", {
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset("./lib/lambda"),
      handler: "alertScript.lambda_handler",
      environment: { ALERT_TOPIC_ARN: topic.topicArn },
    });

    let publishpolicy = new iam.PolicyStatement({
        actions: ['sns:publish'],
        resources: ['*']
    })

    lam.addToRolePolicy(publishpolicy);

    new cdk.CfnOutput(this, "alertlambdaadi", {
      value: lam.functionName,
      exportName: "alertlambdaadi",
    });
  }
}
