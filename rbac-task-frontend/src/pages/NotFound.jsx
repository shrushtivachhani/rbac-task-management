import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Not Found</h1>
        <p className="mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="underline text-sky-600">Go to Home</Link>
      </div>
    </div>
  );
}
