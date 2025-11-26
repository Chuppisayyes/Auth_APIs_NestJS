export function parsePrismaError(e: any) {
  return {
    name: e?.name ?? 'UnknownError',
    code: e?.code ?? 'UNKNOWN',
    message: e?.message ?? 'No message',
    meta: e?.meta ?? null,
    stack: e?.stack ?? null,
  };
}
