import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Treatment/sections/dashboard";
import TreatedTransactions from "../Layouts/Treatment/sections/treatedTransactions";
import TreatmentMachine from "../../OtherComponents/Sections/treatmentMachine";
import Calendar from "../Layouts/Treatment/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Documents from "../../OtherComponents/Sections/documents";

const TreatmentRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<TreatedTransactions user={user} />}
      />
      <Route
        path="treatmentMachines"
        element={<TreatmentMachine user={user} />}
      />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default TreatmentRoutes;
