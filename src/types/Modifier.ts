import { Condition } from "./Condition";

export interface AffectableTraits {
  conditions: Set<Condition>,
  energy: number,
  hunger: number,
  stress: number,
  thirst: number,
}

export enum ModifierType {
  LIFETIME,
  ENERGY,
  STATUS,
  ACTION,
  THIRST,
  STRESS,
  HUNGER
}

export interface Modifier {
  type: ModifierType
  duration: number
  isPermanent?: boolean
  affect: (traits: AffectableTraits) => AffectableTraits
}

export interface EnergyModifier extends Modifier {
  type: ModifierType.ENERGY
}

export interface StatusModifier extends Modifier {
  type: ModifierType.STATUS
}

export interface ThirstModifier extends Modifier {
  type: ModifierType.THIRST
}

export interface StressModifier extends Modifier {
  type: ModifierType.STRESS,
}

export interface HungerModifier extends Modifier {
  type: ModifierType.HUNGER,
}

