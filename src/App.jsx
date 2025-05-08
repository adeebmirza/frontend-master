import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from './routes';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home route with header */}
        <Route path="/" element={<MainLayout showHeader={true}>{publicRoutes[0].element}</MainLayout>} />

        {/* Public Routes without header */}
        {publicRoutes.slice(1).map(({ path, element }) => (
          <Route 
            key={path} 
            path={path} 
            element={<MainLayout showHeader={false}>{element}</MainLayout>} 
          />
        ))}

        {/* Private Routes without header */}
        {privateRoutes.map(({ path, element }) => (
          <Route 
            key={path} 
            path={path} 
            element={
              <PrivateRoute>
                <MainLayout showHeader={false}>{element}</MainLayout>
              </PrivateRoute>
            } 
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
