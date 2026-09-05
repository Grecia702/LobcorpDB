export interface resist {
  red: string | number
  white: string | number
  black: string | number 
  pale: string | number
}

export interface abno {
  id: number?;
  code: string;
  portrait: string;
  name: string;
  tier: string;
  hp: number;
  resistances: resist;
  qlipoth: number
}