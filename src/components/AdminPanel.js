import React, { useState, useEffect } from "react";

export default function AdminPanel({ user }) {
  if (!user) return null; // show only for logged-in admin

  return (
    <section className="p-8 bg-yellow-50">
      <h2 className="text-2xl font-bold mb-4">Admin Panelis</h2>
      <p>Pievieno vai rediģē produktus un iedvesmas vienumus šeit.</p>
      {/* Later we can add forms to add products and inspirations */}
    </section>
  );
}
