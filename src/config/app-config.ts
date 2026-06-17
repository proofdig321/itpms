import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "ITPMS",
  version: packageJson.version,
  copyright: `© ${currentYear}, ITPMS.`,
  meta: {
    title: "ITPMS - IT Project Management System",
    description:
      "IT Project Management System for municipal ICT project portfolio management, planning, and monitoring.",
  },
};
