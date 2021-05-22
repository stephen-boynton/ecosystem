import { StressModifier, ModifierType, EnergyModifier, AffectableTraits } from '../types'

export const Exhaustion: [StressModifier, EnergyModifier] = [
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
      return { ...rest, energy: energy - 4 }
    },
    duration: 1
  }
]