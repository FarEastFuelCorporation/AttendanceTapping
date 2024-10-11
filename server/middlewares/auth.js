// middlewares/auth.js

// Middleware to check authentication and role
const isAuthenticated = (req, res, next) => {
  const userRole = req;
  const requestedPath = req.path;

  console.log("request" + req);

  if (req.session && req.session.user && req.session.user.userType) {
    // Check if user's role allows access to the requested route
    const isAuthorized =
      (requestedPath.startsWith("/marketingDashboard") && userRole === 2) ||
      (requestedPath.startsWith("/dispatchingDashboard") && userRole === 3) ||
      (requestedPath.startsWith("/receivingDashboard") && userRole === 4) ||
      (requestedPath.startsWith("/certificationDashboard") && userRole === 7) ||
      (requestedPath.startsWith("/hrDashboard") && userRole === 9);

    if (isAuthorized) {
      console.log("User is authorized");
      // User is authenticated and authorized, proceed to the next middleware or route handler
      next();
    } else {
      console.log("User is not authorized");
      res.status(403).json({ authenticated: false, message: "Unauthorized" });
    }
  } else {
    console.log("User is not authenticated");
    res
      .status(401)
      .json({ authenticated: false, message: "Not authenticated" });
  }
};

module.exports = { isAuthenticated };
