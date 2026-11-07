export interface resist {
  Red: string | number
  White: string | number
  Black: string | number
  Pale: string | number
}

export interface abno {
  code: string;
  portrait: string;
  name: string;
  tier: string;
  hp: number | string;
  resistances: resist;
  qlipoth: number
  workDamage: string
}