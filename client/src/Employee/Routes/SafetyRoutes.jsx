import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Safety/sections/dashboard";
import Clients from "../../OtherComponents/Sections/clients";
import Documents from "../../OtherComponents/Sections/documents";
import Calendar from "../Layouts/Safety/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const SafetyRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default SafetyRoutes;
