import next from "eslint-config-next/core-web-vitals";
export default [
  ...next,
  { ignores: ["**/dist/**", "**/.next/**", "packages/contracts/generated/**"] },
];
