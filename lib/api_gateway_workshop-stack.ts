import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class ApiGatewayWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Crear la función Lambda
    const myFunction = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_18_X, // Define la versión de Node.js
      handler: 'handler.main', // Define el archivo y la función de entrada (handler.ts y main)
      code: lambda.Code.fromAsset('lambda'), // Ubicación del código Lambda
    });

    // Crear API Gateway y conectar con la Lambda
    const api = new apigateway.LambdaRestApi(this, 'MyApi', {
      handler: myFunction,
      proxy: false, // Define si deseas un comportamiento más detallado (opcional)
    });

    // Configurar CORS en API Gateway
    const corsOptions = {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    };

    // Agregar un recurso y método a la API
    // Configurar CORS en API Gateway
    const items = api.root.addResource('items'); // Crea un recurso "items"
    items.addMethod('GET', new apigateway.LambdaIntegration(myFunction), {
      // Configurar CORS en este método
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
        },
      ],
    });

    // Agregar el recurso /traerboton y método GET
    const traerBoton = api.root.addResource('traerboton');
    traerBoton.addMethod('GET', new apigateway.LambdaIntegration(myFunction), {
      // Configurar CORS en este método
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
        },
      ],
    });

    // Crear un bucket de S3 para el sitio web
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true, // Hacer el bucket público para acceder al sitio web
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // Utiliza la configuración adecuada para permitir el acceso público
    });

    // Desplegar el archivo index.html en el bucket de S3
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./static')], // Ruta a la carpeta con index.html
      destinationBucket: websiteBucket,
    });
  }
}
