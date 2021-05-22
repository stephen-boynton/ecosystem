import { StressModifier, ModifierType, EnergyModifier, AffectableTraits, ThirstModifier } from '../types'

export const Hydrated: [StressModifier, EnergyModifier, ThirstModifier] = [
  {
    type: ModifierType.STRESS,
    affect({ stress, ...rest }: AffectableTraits): AffectableTraits {
      return { ...rest, stress: stress - 5 }
    },
    duration: 1
  },
  {
    type: ModifierType.ENERGY,
    affect({ energy, ...rest }: AffectableTraits): AffectableTraits {
      return { ...rest, energy: energy + 4 }
    },
    duration: 1
  },
  {
    type: ModifierType.THIRST,
    affect({ ...rest }: AffectableTraits): AffectableTraits {
      return { ...rest, thirst: 0 }
    },
    duration: 1
  },
  
]