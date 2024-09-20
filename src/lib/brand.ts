export type Brand<Base, Branding, ReservedName extends string = '__type__'> = Base & {
  [K in ReservedName]: Branding;
} & { __witness__: Base };
