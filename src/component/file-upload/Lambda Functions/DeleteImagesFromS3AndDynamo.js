var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  var image_id = event["body"]["Key"]["Image_ID"];
  //var image_id = event['Image_ID']
  deleteImageS3(image_id);
  deleteImageData(image_id).then(() => {
    callback(null, { statusCode: 200, message: "Image Successfully deleted" });
  });
};

function deleteImageS3(image_id) {
  var check = false;
  var s3 = new AWS.S3();
  var params = { Bucket: "assign3bucketwaa", Key: image_id };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // error
    else {
      check = true;
    } // deleted
  });
  return check;
}

function deleteImageData(image_id) {
  return ddb
    .delete({
      TableName: "ImageData",
      Key: {
        Image_ID: image_id, // userId is my PK in this case
      },
    })
    .promise();
}
