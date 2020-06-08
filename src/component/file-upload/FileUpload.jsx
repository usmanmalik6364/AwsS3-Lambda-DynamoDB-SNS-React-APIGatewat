import React, { Component } from "react";
import axios from "axios";
import * as styles from "./FileUpload.module.css";
import AWS from "aws-sdk";
//import Async from "react-async";

AWS.config.region = "us-east-1"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:c89a5595-0668-4c67-b32a-6cdf1cb2caf2",
});
export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileToUpload: undefined,
      uploadSuccess: undefined,
      error: undefined,
      value: undefined,
      image_url: undefined,
      bucket_name: undefined,
      image_name: undefined,
      delete_status: undefined,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDelete = this.handleChangeDelete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleDelete(event) {
    alert(this.state.image_name);
    event.preventDefault();
    console.log(this.state.image_name);
    var url =
      "https://86h6p2tsf1.execute-api.us-east-1.amazonaws.com/Develop/deleteimage?Image_ID=" +
      this.state.image_name;
    axios({
      method: "DELETE",
      url: url,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        this.setState({
          delete_status: "File deleted Successfully",
        });
        alert("Your file has been deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleChangeDelete(event) {
    event.preventDefault();
    this.setState({ image_name: event.target.value });
    /**/
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("The Image name is :   " + this.state.value);
    event.preventDefault();
    fetch(
      "https://86h6p2tsf1.execute-api.us-east-1.amazonaws.com/Develop/s3urlfromdynamodb?Image_ID=" +
        this.state.value
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result == undefined) alert("Image does not exists");
          else {
            console.log(result["Items"][0]["object_url"]);
            var temp = result["Items"][0]["object_url"];
            this.setState({
              image_url: temp["S"],
            });
          }
        },
        (error) => {
          console.log("ERROR fetching from API");
        }
      );
  }

  uploadFile() {
    // Getting the signed url
    axios(
      "https://86h6p2tsf1.execute-api.us-east-1.amazonaws.com/Develop/s3presignedurl?fileName=" +
        this.state.fileToUpload.name
    ).then((response) => {
      // Getting the url from response
      const url = response.data.fileUploadURL;

      axios({
        method: "PUT",
        url: url,
        data: this.state.fileToUpload,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          this.setState({
            uploadSuccess: "File upload successfull",
            error: undefined,
          });
        })
        .catch((err) => {
          this.setState({
            error: "Error Occured while uploading the file",
            uploadSuccess: undefined,
          });
        });
    });
  }

  render() {
    return (
      <div className={styles.fileUploadCont}>
        <div className={styles.header}>
          File Upload to S3 with Lambda, And React axios Application
        </div>
        <div>
          <form>
            <div className="form-group">
              <input
                type="file"
                className="form-control-file"
                id="fileUpload"
                onChange={(e) => {
                  this.setState({
                    fileToUpload: e.target.files[0],
                  });
                }}
              />
              {this.state.fileToUpload ? (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={(e) => {
                    this.uploadFile();
                  }}
                >
                  Upload your file
                </button>
              ) : null}

              <div>
                <span>
                  {this.state.uploadSuccess ? "File Upload Successfully" : ""}
                </span>
              </div>
            </div>
          </form>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Image Name:
              <textarea value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit"></input>
          </form>
        </div>
        <div>
          <span>
            {this.state.image_url ? (
              <img
                id="img_show"
                src={this.state.image_url}
                alt="S3ImageRequested"
                width="500"
                height="600"
              />
            ) : (
              ""
            )}
          </span>
        </div>
        <div>
          <form onSubmit={this.handleDelete}>
            <label>
              Image to be deleted:
              <textarea
                value={this.state.image_name}
                onChange={this.handleChangeDelete}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}
