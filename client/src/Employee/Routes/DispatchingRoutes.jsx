import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../../Employee/Layouts/Dispatching/sections/dashboard";
import DispatchedTransactions from "../Layouts/Dispatching/sections/dispatchedTransactions";
import VehicleLocation from "../Layouts/Dispatching/sections/vehicleLocation";
import VehicleTypes from "../../OtherComponents/Sections/vehicleTypes";
import Vehicles from "../../OtherComponents/Sections/vehicles";
import VehicleMaintenanceRequest from "../../OtherComponents/Sections/vehicleMaintenanceRequest";
import Calendar from "../../Employee/Layouts/Dispatching/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Documents from "../../OtherComponents/Sections/documents";

const DispatchingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route
        path="transactions"
        element={<DispatchedTransactions user={user} />}
      />
      <Route path="vehicleLocation" element={<VehicleLocation user={user} />} />
      <Route path="vehicleTypes" element={<VehicleTypes user={user} />} />
      <Route path="vehicles" element={<Vehicles user={user} />} />
      <Route
        path="vehicleMaintenanceRequests"
        element={<VehicleMaintenanceRequest user={user} />}
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

export default DispatchingRoutes;
