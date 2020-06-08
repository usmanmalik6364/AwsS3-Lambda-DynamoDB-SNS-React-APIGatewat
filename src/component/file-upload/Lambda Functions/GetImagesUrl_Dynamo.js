var AWS = require("aws-sdk");
var response = {
  statusCode: 500,
  body: JSON.stringify("Record does not exists"),
};

exports.handler = function (event, context) {
  var AWS = require("aws-sdk");

  AWS.config.update({
    region: "us-east-1",
  });

  var docClient = new AWS.DynamoDB.DocumentClient();

  var table = "ImageData";

  var params = {
    TableName: table,
    Key: {
      key: "waheed.jpg",
    },
  };

  docClient.get(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to read item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      var response = {
        statusCode: 200,
        body: JSON.stringify(data, null, 2),
        headers: {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      };
      console.log("response : " + response["body"]);
      return response;
    }
  });

  return response;
};
