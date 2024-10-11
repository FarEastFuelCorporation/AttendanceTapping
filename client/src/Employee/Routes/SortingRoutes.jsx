import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Sorting/sections/dashboard";
import SortedTransactions from "../Layouts/Sorting/sections/sortedTransactions";
import ScrapTypes from "../../OtherComponents/Sections/scrapTypes";
import Calendar from "../Layouts/Sorting/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Documents from "../../OtherComponents/Sections/documents";

const SortingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="transactions" element={<SortedTransactions user={user} />} />
      <Route path="scrapTypes" element={<ScrapTypes user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default SortingRoutes;
