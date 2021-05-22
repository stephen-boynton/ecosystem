import {StressModifier, ModifierType, EnergyModifier, AffectableTraits } from '../types'

export const Emaciated: [StressModifier, EnergyModifier] = [
  {
    type: ModifierType.STRESS,
    affect({ stress, ...rest }: AffectableTraits): AffectableTraits {
      return { ...rest, stress: stress + 5 }
    },
    duration: 1
  },
  {
    type: ModifierType.ENERGY,
    affect({ energy, ...rest }: AffectableTraits): AffectableTraits {
      const percentage = 0.2;
      return { ...rest, energy: energy - (energy * percentage) }
    },
    duration: 1
  }
]