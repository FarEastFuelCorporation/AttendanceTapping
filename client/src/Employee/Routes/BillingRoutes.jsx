import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Billing/sections/dashboard";
import Clients from "../../OtherComponents/Sections/clients";
import TypeOfWastes from "../../OtherComponents/Sections/typeOfWaste";
import BilledTransactions from "../Layouts/Billing/sections/billedTransactions";
import Quotations from "../../OtherComponents/Sections/quotations";
import Documents from "../../OtherComponents/Sections/documents";
import Calendar from "../Layouts/Billing/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const BillingRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route path="transactions" element={<BilledTransactions user={user} />} />
      <Route path="quotations" element={<Quotations user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default BillingRoutes;
