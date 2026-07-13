export type IActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string }
