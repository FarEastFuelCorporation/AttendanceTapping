import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Collection/sections/dashboard";
import Clients from "../../OtherComponents/Sections/clients";
import TypeOfWastes from "../../OtherComponents/Sections/typeOfWaste";
import CollectedTransactions from "../Layouts/Collection/sections/collectedTransactions";
import Quotations from "../../OtherComponents/Sections/quotations";
import Documents from "../../OtherComponents/Sections/documents";
import Calendar from "../Layouts/Collection/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";

const CollectionRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    {" "}
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route
        path="transactions"
        element={<CollectedTransactions user={user} />}
      />
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

export default CollectionRoutes;
