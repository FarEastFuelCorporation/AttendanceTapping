import React from "react";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="landing-page-content">
        <img
          src={`../../assets/logo.png`}
          alt=""
          style={{ width: "100px", height: "auto" }}
        />
        <h1>
          FAR EAST FUEL CORPORATION <br />
          <i>INTEGRATED SYSTEM</i>
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;
