import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      BrowserRouter: ({ children }) => <div>{children}</div>,
      Routes: ({ children }) => <div>{children}</div>,
      Route: ({ element, children }) => (
        <>
          {element}
          {children}
        </>
      ),
      Link: ({ children, to, ...props }) => (
        <a href={to} {...props}>
          {children}
        </a>
      ),
      Outlet: ({ children }) => <div>{children}</div>,
      useLocation: () => ({ pathname: "/" }),
    };
  },
  { virtual: true }
);

jest.mock(
  "axios",
  () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
  { virtual: true }
);

import App from "./App";

describe("App", () => {
  it("muestra los enlaces de navegación principales", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /inicio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /clientes/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /transacciones/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /agencias/i })).toBeInTheDocument();
  });
});
