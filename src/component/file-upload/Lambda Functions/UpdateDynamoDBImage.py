import json
import boto3


def lambda_handler(event, context):
    message = event['Records'][0]['Sns']['Message']
    message = json.loads(message)
    bucket_name = message['Records'][0]['s3']['bucket']['name']
    object_key = message['Records'][0]['s3']['object']['key']
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('ImageData')
    response = table.put_item(
        Item={
            'Image_ID': object_key,
            'bucket_name': bucket_name,
            'object_url': 'https://assign3bucketwaa.s3.amazonaws.com/' + object_key
        }
    )
