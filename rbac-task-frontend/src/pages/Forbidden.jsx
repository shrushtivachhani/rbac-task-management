import React from 'react';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403 — Forbidden</h1>
        <p className="mb-6">You don't have permission to access this page.</p>
        <Link to="/" className="underline text-sky-600">Go to Home</Link>
      </div>
    </div>
  );
}
