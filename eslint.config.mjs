import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Nonaktifkan aturan yang melarang 'any' secara eksplisit
      // 'off' akan menonaktifkan aturan ini.
      // Anda juga bisa menggunakan 'warn' jika ingin hanya sebagai peringatan.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;