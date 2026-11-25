# Security Specification — Tuğçe Utku Blog Persistence

## 1. Data Invariants
1. Public website visitors can read (`get`, `list`) published documents in `/blogPosts/{postId}` and `/deletedBlogIds/{postId}`, and `get` `/siteSettings/featuredBlog`, without authentication, because these collections contain strictly public editorial configuration/articles and zero PII.
2. Only verified administrators (`request.auth != null`, `request.auth.token.email_verified == true`, and either the bootstrapped admin email `selmanutkumarmara@gmail.com` or an existing `/admins/{uid}` record) can create, update, or delete `/blogPosts/{postId}`, `/deletedBlogIds/{postId}`, or `/siteSettings/{settingId}`.
3. Every `blogPosts/{postId}` and `siteSettings/{settingId}` document ID must match `^[a-zA-Z0-9_\-]+$` (<= 128 chars) and strictly equal `incoming().id`.
4. `authorId` on `blogPosts` must equal `request.auth.uid` on create and remain immutable on update; `updatedBy` on `siteSettings` must equal `request.auth.uid` on create and update.
5. `createdAt` must equal `request.time` on create and remain immutable on update; `updatedAt` must equal `request.time` on both create and update.
6. Unknown/shadow fields are rejected via `keys().hasAll(...)` + `keys().hasOnly(...)` and `affectedKeys().hasOnly(...)`.
7. Volumetric limits (`title <= 240`, `h1Title <= 240`, `spot <= 1000`, `coverImage <= 750000`, `trashedAt <= 40`, `tags.size() <= 15`, `sections.size() <= 50`) prevent 1 MB overflow and denial-of-wallet payloads.

## 2. Dirty Dozen Adversarial Payloads
1. Unauthenticated `create` on `/blogPosts/custom-1` -> `PERMISSION_DENIED`.
2. Signed-in non-admin user (`other@example.com`, `email_verified: true`) attempting `create` on `/blogPosts/custom-1` -> `PERMISSION_DENIED`.
3. Spoofed admin email with `email_verified: false` attempting `create` on `/blogPosts/custom-1` -> `PERMISSION_DENIED`.
4. Admin attempting `create` with a shadow field `{ ..., isSuperAdmin: true }` -> `PERMISSION_DENIED`.
5. Admin attempting `create` with `authorId != request.auth.uid` -> `PERMISSION_DENIED`.
6. Admin attempting `create` with forged client `createdAt` (`!= request.time`) -> `PERMISSION_DENIED`.
7. Admin attempting `update` changing immutable `createdAt` or `authorId` -> `PERMISSION_DENIED`.
8. Admin attempting `create` with invalid `categoryKey: "unknown"` -> `PERMISSION_DENIED`.
9. Admin attempting `create` with oversized `coverImage` (`> 750000` chars) or `h1Title` (`> 240` chars) -> `PERMISSION_DENIED`.
10. Admin attempting `create` with oversized/malformed path ID (`a/b` or > 128 chars) -> `PERMISSION_DENIED`.
11. Unauthenticated or non-admin attempting `create` or `update` on `/siteSettings/featuredBlog` -> `PERMISSION_DENIED`.
12. Signed-in non-admin attempting `list` on `/siteSettings` or `get`/`create` on `/admins/{uid}` -> `PERMISSION_DENIED`.
