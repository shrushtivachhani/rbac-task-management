import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import HRDashboard from './pages/dashboards/HRDashboard';
import BDMDashboard from './pages/dashboards/BDMDashboard';
import ASMDashboard from './pages/dashboards/ASMDashboard';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard';
import SuperEmployeeDashboard from './pages/dashboards/SuperEmployeeDashboard';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['HR']} />}>
          <Route path="/dashboard/hr/*" element={<HRDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['BDM']} />}>
          <Route path="/dashboard/bdm/*" element={<BDMDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ASM']} />}>
          <Route path="/dashboard/asm/*" element={<ASMDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
          <Route path="/dashboard/employee/*" element={<EmployeeDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Super Employee']} />}>
          <Route path="/dashboard/super/*" element={<SuperEmployeeDashboard />} />
        </Route>

        {/* Routes accessible to multiple roles */}
        <Route element={<ProtectedRoute allowedRoles={['Admin','HR','BDM','ASM','Employee','Super Employee']} />}>
          <Route path="/dashboard/shared/tasks" element={<div className="p-6">Shared task list placeholder</div>} />
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}
