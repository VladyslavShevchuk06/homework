// Connective snippet: the new entity OWNS its endpoints and its cache keys, both
// declared in its own model file — src/app/entities/models/<entity>.model.ts.
// There is deliberately no project-wide key enum: one enum for every entity is a hub
// that makes each slice depend on the declarations of all the others.

// endpoints for this entity
export enum E<Entity>Api {
  LIST = '/api/<entity>',
  BY_ID = '/api/<entity>/:id',
}

// TanStack query keys for this entity
export enum E<Entity>Key {
  LIST = '<entity>-list',
  DETAIL = '<entity>-detail',
}

// Referenced from:
//   - <api>.query.ts    → queryKey: [E<Entity>Key.LIST, ...params]
//   - <api>.mutation.ts → invalidateQueries({ queryKey: [E<Entity>Key.LIST] })
//   - <api>.api.ts      → fetch(E<Entity>Api.LIST)
// Query/mutation file shapes live in client-structure/examples + references/state-management.md.
//
// models/ is a GROUPING folder (independent entities), so it ships NO barrel:
// consumers import '@/app/entities/models/<entity>.model' by path.
