import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const hasCustomDomain = process.env.CUSTOM_DOMAIN === "true";
const repository = process.env.GITHUB_REPOSITORY ?? "";
const repoName = repository.split("/")[1] ?? "";
const isUserOrOrgPage = repoName.endsWith(".github.io");
const githubPagesBasePath =
  !hasCustomDomain && isGithubActions && repoName && !isUserOrOrgPage
    ? `/${repoName}`
    : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: githubPagesBasePath || undefined,
  assetPrefix: githubPagesBasePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
