import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

describe("Navbar", () => {
  test("shows sign-in button when no user", () => {
    render(<Navbar user={null} />);
    expect(screen.getByText(/Pieslēgties/i)).toBeInTheDocument();
  });

  test("shows profile button when user provided", () => {
    const user = { displayName: "Anna", email: "a@example.com" };
    render(<Navbar user={user} />);
    // Expect the profile initial or image to appear
    expect(screen.getByTitle(/Anna|a@example.com/)).toBeInTheDocument();
  });
});
