import kleur from 'kleur';

export const log = {
  info: (msg: string) => console.log(kleur.cyan(msg)),
  success: (msg: string) => console.log(kleur.green(msg)),
  error: (msg: string) => console.error(kleur.red(msg))
};
