import { StressModifier, ModifierType, EnergyModifier, AffectableTraits, HungerModifier } from '../types'

export const FullStomach: [StressModifier, EnergyModifier, HungerModifier ] = [
  {
    type: ModifierType.STRESS,
    affect({ stress, ...rest }: AffectableTraits): AffectableTraits {
      return { ...rest, stress: stress - 10 }
    },
    duration: 1
  },
  {
    type: ModifierType.ENERGY,
    affect({ energy, ...rest }: AffectableTraits): AffectableTraits {
      return { ...rest, energy: energy + 20 }
    },
    duration: 1
  },
  {
    type: ModifierType.HUNGER,
    affect({ ...rest }: AffectableTraits): AffectableTraits {
      return { ...rest, hunger: 0 }
    },
    duration: 1
  },
  
]