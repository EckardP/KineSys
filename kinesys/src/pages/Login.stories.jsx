import { MemoryRouter } from "react-router-dom"

import { AuthProvider } from "../context/AuthContext"
import Login from "./Login"

export default {
  title: "UIn-1/Screens/Login",
  component: Login,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (_Story) => (
      <MemoryRouter>
        <AuthProvider>
          <_Story />
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
}

export const Default = {}
