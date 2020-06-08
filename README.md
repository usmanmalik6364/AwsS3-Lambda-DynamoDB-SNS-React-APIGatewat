# AwsS3-Lambda-DynamoDB-SNS-React-APIGateway
This repository contains a react app which uses aws  A front react app to communicate with AWS API gateway and store images on S3. The relevant image information is stored in AWS dynamoDB. 
The architectural diagram for different use cases are attached as images in this repo.
This project consists of three use case.

1st Use case:
Get a presigned url from Lambda using API gateway as a proxy and store image in S3.

2nd Use case:
Get an image from DynamoDb using AWS integration Request Template.

3rd Use Case:
Delete all the Image data from DynamoDB and S3.
