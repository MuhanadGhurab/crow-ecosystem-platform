export type { PlatformOwnerBootstrapRefusal } from "@/lib/platform/platform-owner-bootstrap.resolution";
export { detectForbiddenPlatformOwnerCredentials } from "@/lib/platform/platform-owner-bootstrap.guards";
export {
  resolveDesignatedPlatformOwnerByEmail,
  planPlatformOwnerBootstrapByAccountId,
  resolutionManifestDigest,
  type PlatformOwnerResolutionResult,
  type PlatformOwnerBootstrapChecks,
} from "@/lib/platform/platform-owner-bootstrap.resolution";
