export const HTTPResponse = {
  Redirect: ({ to }: { to: string }) => ({
    status: 302,
    headers: {
      Location: to,
    },
  }),

  NoContent: () => ({
    status: 204,
    headers: {},
  }),

  OK: <TBody>({ body }: { body: TBody }) => ({
    status: 200,
    headers: {},
    body,
  }),
};
