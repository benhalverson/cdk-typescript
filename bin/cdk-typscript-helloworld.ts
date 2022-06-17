#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkTypscriptHelloworldStack } from '../lib/cdk-typscript-helloworld-stack';

const app = new cdk.App();
new CdkTypscriptHelloworldStack(app, 'CdkTypscriptHelloworldStack');
