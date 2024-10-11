// controllers/othersController.js

async function homeController(req, res) {
  try {
    // Access the session variable
    const username = req.session.username || "Guest";

    // Render the 'home' view and pass the session data
    const viewsData = {
      pageTitle: "FAR EAST FUEL CORPORATION",
      username,
    };
    // res.render("home", viewsData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function logoutController(req, res) {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Clear the cookie
        res.clearCookie("connect.sid", { path: "/" });

        // Prevent caching
        res.setHeader("Cache-Control", "no-store");

        // Redirect to the login page after successful logout
        res.status(200).send("Logged out successfully");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function error404Controller(req, res, next) {
  res.status(404).send("404 Not Found");
}

module.exports = {
  homeController,
  logoutController,
  error404Controller,
};
