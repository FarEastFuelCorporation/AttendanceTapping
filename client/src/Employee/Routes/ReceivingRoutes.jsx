import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../../Employee/Layouts/Receiving/sections/dashboard";
import ReceivedTransactions from "../Layouts/Receiving/sections/receivedTransactions";
import VehicleTypes from "../../OtherComponents/Sections/vehicleTypes";
import Vehicles from "../../OtherComponents/Sections/vehicles";
import Calendar from "../../Employee/Layouts/Receiving/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Documents from "../../OtherComponents/Sections/documents";

const ReceivingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<ReceivedTransactions user={user} />}
      />
      <Route path="vehicleTypes" element={<VehicleTypes user={user} />} />
      <Route path="vehicles" element={<Vehicles user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default ReceivingRoutes;
