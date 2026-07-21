import next from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...next,
  {
    ignores: ["**/dist/**", "**/.next/**", "packages/contracts/generated/**"],
  },
];

export default eslintConfig;
