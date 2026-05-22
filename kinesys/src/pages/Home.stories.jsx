import { MemoryRouter } from "react-router-dom"

import Home from "./Home"

export default {
  title: "UIn-1/Screens/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (_Story) => (
      <MemoryRouter>
        <_Story />
      </MemoryRouter>
    ),
  ],
}

export const PublicLanding = {}
