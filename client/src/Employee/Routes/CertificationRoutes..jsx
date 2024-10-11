import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSidebar from "../../OtherComponents/UserSidebar";
import Dashboard from "../Layouts/Certification/sections/dashboard";
import CertifiedTransactions from "../Layouts/Certification/sections/certifiedTransactions";
import PlasticTransactions from "../../OtherComponents/Sections/plasticTransactions";
import Clients from "../../OtherComponents/Sections/clients";
import TreatmentProcess from "../../OtherComponents/Sections/treatmentProcess";
import TypeOfWastes from "../../OtherComponents/Sections/typeOfWaste";
import Calendar from "../Layouts/Certification/sections/calendar";
import SwitchUsers from "../../OtherComponents/Sections/switchUsers";
import Documents from "../../OtherComponents/Sections/documents";

const CertificationRoutes = ({ user, onUpdateUser }) => (
  <Routes>
    <Route path="/" element={<UserSidebar user={user} />}>
      <Route path="" element={<Dashboard />} />
      <Route path="clients" element={<Clients user={user} />} />
      <Route
        path="transactions"
        element={<CertifiedTransactions user={user} />}
      />
      <Route
        path="plasticTransactions"
        element={<PlasticTransactions user={user} />}
      />
      <Route
        path="treatmentProcess"
        element={<TreatmentProcess user={user} />}
      />
      <Route path="typeOfWastes" element={<TypeOfWastes user={user} />} />
      <Route path="documents" element={<Documents user={user} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route
        path="switchUser"
        element={<SwitchUsers user={user} onUpdateUser={onUpdateUser} />}
      />
    </Route>
  </Routes>
);

export default CertificationRoutes;
