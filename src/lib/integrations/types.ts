/**
 * Every integration fetcher returns one of these instead of throwing:
 * - disabled: required env vars unset — the card should render nothing
 * - unreachable: service didn't respond / errored — card shows a soft failure
 * - ok: data ready
 */
export type IntegrationResult<T> =
  | { status: "disabled" }
  | { status: "unreachable"; error: string }
  | { status: "ok"; data: T };
