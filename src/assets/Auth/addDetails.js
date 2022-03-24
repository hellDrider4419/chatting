import React from "react";

class AddDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
    };
  }

  handleUpdateInfo = () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);
  };

  render() {
    return (
      <div className="profile_page">
        <div className="innerContainer">
          <label for="signupProfile">
            <div className="profileImage"></div>
          </label>
          <input
            id="signupProfile"
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/gif, image/jpeg"
            onChange={(e) => {
              this.setState({ selectedFile: e.target.files[0] });
            }}
          ></input>

          <div className="des_heading">Add description for your profile</div>
          <input type="text" className="des_field"></input>
          <div className="save_profile_Image_btn">save and next</div>
        </div>
      </div>
    );
  }
}

export default AddDetails;
