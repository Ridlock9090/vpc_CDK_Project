import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds'

interface RDSStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class RDSStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: RDSStackProps) {
        super(scope, id, props);

        // RDS Configuration here
    
    const dbSubnetSelection = props.vpc.selectSubnets({
        subnetGroupName: 'Database',
        onePerAz: true,
    });

    const rdsDatabase = new rds.DatabaseInstance(this, 'MyRDSDatabase', {
        vpc: props.vpc,
        multiAz: true,
        vpcSubnets: dbSubnetSelection,
        engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_42 }),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        allocatedStorage: 20,
        maxAllocatedStorage: 30,
        deletionProtection: false
    });
    cdk.Tags.of(rdsDatabase).add('Name', 'MyRDSDatabase');

    new cdk.CfnOutput(this, 'RDSEndpoint', {
        value: rdsDatabase.dbInstanceEndpointAddress,
        description: 'The endpoint address of the RDS MySQL instance',
        exportName: `${this.stackName}-RDSEndpoint`,
    });

    }
}