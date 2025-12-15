import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock form components for testing
const LoginForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ username: "test", password: "pass" });
    }}
  >
    <input name="username" placeholder="Username" />
    <input name="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
);

const RegisterForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ name: "Test", email: "test@example.com" });
    }}
  >
    <input name="name" placeholder="Name" />
    <input name="email" placeholder="Email" />
    <input name="password" type="password" placeholder="Password" />
    <input name="confirmPassword" type="password" placeholder="Confirm Password" />
    <button type="submit">Register</button>
  </form>
);

const ProfileForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ name: "Updated", email: "new@example.com" });
    }}
  >
    <input name="name" placeholder="Name" defaultValue="Test User" />
    <input name="email" placeholder="Email" defaultValue="test@example.com" />
    <button type="submit">Update Profile</button>
  </form>
);

const AssignmentForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ title: "Math HW", description: "Complete exercises" });
    }}
  >
    <input name="title" placeholder="Title" />
    <textarea name="description" placeholder="Description" />
    <input name="dueDate" type="date" />
    <button type="submit">Create Assignment</button>
  </form>
);

describe("Login Form", () => {
  it("renders login form fields", () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("submits login form with credentials", async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: "test",
        password: "pass",
      });
    });
  });
});

describe("Registration Form", () => {
  it("renders registration form fields", () => {
    render(<RegisterForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("submits registration form", async () => {
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});

describe("Profile Update Form", () => {
  it("renders profile form with default values", () => {
    render(<ProfileForm onSubmit={vi.fn()} />);
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  it("submits profile update", async () => {
    const onSubmit = vi.fn();
    render(<ProfileForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByText("Update Profile"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Updated",
        email: "new@example.com",
      });
    });
  });
});

describe("Assignment Creation Form", () => {
  it("renders assignment form fields", () => {
    render(<AssignmentForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
  });

  it("submits assignment creation", async () => {
    const onSubmit = vi.fn();
    render(<AssignmentForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByText("Create Assignment"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Math HW",
        description: "Complete exercises",
      });
    });
  });
});
