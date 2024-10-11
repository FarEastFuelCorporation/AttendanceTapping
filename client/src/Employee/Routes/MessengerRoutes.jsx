import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Messenger/sections/dashboard";
import Clients from "../../OtherComponents/Sections/clients";
import BillingDistributionTransactions from "../Layouts/Messenger/sections/billingDistributionTransactions";
import Calendar from "../Layouts/Messenger/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const MessengerRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route
        path="transactions"
        element={<BillingDistributionTransactions user={user} />}
      />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default MessengerRoutes;
