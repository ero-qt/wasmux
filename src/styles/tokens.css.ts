import { createThemeContract } from "@vanilla-extract/css";
import { themeContract } from "~/styles/themes/types";

export const tokens = createThemeContract({
  theme: themeContract,
});
