import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Navbar({ user }) {
  return (
    <nav className="bg-green-100 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ZanesPušķīši</h1>
      <ul className="flex gap-4">
        <li>
          <a href="#produkti">Produkti</a>
        </li>
        <li>
          <a href="#idejas">Iedvesma</a>
        </li>
        <li>
          <a href="#komentari">Komentāri</a>
        </li>
        {user && (
          <li>
            <button onClick={() => signOut(auth)}>Izrakstīties</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
