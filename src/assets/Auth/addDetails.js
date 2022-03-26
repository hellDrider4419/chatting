import React from "react";
import { updateAbout } from "../../apiCalls/chatApiCall";
import history from "../../history";
import { withRouter } from "../../withRouter";

class AddDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      file_url: null,
      description: "",
    };
  }

  handleUpdateInfo = () => {
    const data = new FormData();
    data.append("files", this.state.selectedFile);
    data.append("userid", parseInt(localStorage.getItem("loginToken"), 10));
    data.append("des", this.state.description);
    data.append("profilePic", this.state.selectedFile.name);
    if (
      parseInt(localStorage.getItem("loginToken"), 10) &&
      this.state.description.length &&
      this.state.selectedFile
    ) {
      updateAbout(data).then((res) => {
        if (res === "updated") {
          history.push("/home");
          this.props.navigate("/home");
        }
      });
    }
  };

  render() {
    return (
      <div className="profile_page">
        <div className="innerContainer">
          <label for="signupProfile">
            <div
              className="profileImage"
              style={
                this.state.selectedFile
                  ? {
                      backgroundImage: `url(${this.state.file_url})`,
                      color: "#00000000",
                    }
                  : { color: "grey" }
              }
            >
              upload image
            </div>
          </label>
          <input
            id="signupProfile"
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/gif, image/jpeg"
            onChange={(e) => {
              this.setState({
                selectedFile: e.target.files[0],
                file_url: e.target.files[0]
                  ? window.URL.createObjectURL(e.target.files[0])
                  : null,
              });
            }}
          ></input>

          <div className="des_heading"></div>
          <input
            type="text"
            value={this.state.description}
            placeholder="Add profile description"
            className="des_field input"
            onChange={(e) => this.setState({ description: e.target.value })}
          ></input>
          <div
            className="save_profile_Image_btn"
            onClick={this.handleUpdateInfo}
          >
            save and next
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AddDetails);
