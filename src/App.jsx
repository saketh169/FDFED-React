import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DietitianProfilesPage from "./pages/DietitianProfilesPage";
import AllDietitiansPage from "./pages/AllDietitiansPage";
import DietitianProfile from "./components/DietitianProfile";

const Home = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-gray-900">
      Welcome to NutriConnect
    </h1>
    <p className="text-gray-600 mt-2">
      Find the perfect nutritionist for your health goals
    </p>
  </div>
);

const About = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
    <p className="text-gray-600 mt-2">Learn more about NutriConnect</p>
  </div>
);

const Contact = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
    <p className="text-gray-600 mt-2">Get in touch with our team</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* All dietitians page */}
        <Route path="dietitians" element={<AllDietitiansPage />} />

        {/* Specialization-specific pages */}
        <Route
          path="/skin-hair"
          element={<DietitianProfilesPage specializationType="skin-hair" />}
        />
        <Route
          path="/womens-health"
          element={<DietitianProfilesPage specializationType="womens-health" />}
        />
        <Route
          path="/weight-management"
          element={
            <DietitianProfilesPage specializationType="weight-management" />
          }
        />
        <Route
          path="/gut-health"
          element={<DietitianProfilesPage specializationType="gut-health" />}
        />
        <Route
          path="/diabetes-thyroid"
          element={
            <DietitianProfilesPage specializationType="diabetes-thyroid" />
          }
        />
        <Route
          path="/cardiac-health"
          element={
            <DietitianProfilesPage specializationType="cardiac-health" />
          }
        />

        <Route path="/dietitian-profiles/:id" element={<DietitianProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
