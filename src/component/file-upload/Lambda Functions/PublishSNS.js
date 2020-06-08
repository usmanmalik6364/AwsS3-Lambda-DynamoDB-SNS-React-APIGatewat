exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Image Upload Success!'),
    };
    return response;
};
var AWS = require("aws-sdk");

exports.handler = function (event, context) {
    var eventText = JSON.stringify(event, null, 2);
    console.log("S3Put Event:", eventText);
    var sns = new AWS.SNS();
    var params = {
        Message: eventText,
        Subject: "Image Upload Successful",
        TopicArn: "arn:aws:sns:us-east-1:337726266338:ImageUploadedSuccessfully"
    };

    sns.publish(params, context.done);
};