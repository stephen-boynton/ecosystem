import {StressModifier, ModifierType, EnergyModifier, AffectableTraits } from '../types'

export const Hunger: [StressModifier, EnergyModifier] = [
  {
    type: ModifierType.STRESS,
    affect({ stress, ...rest }: AffectableTraits): AffectableTraits {
      console.log('stress increase...')
      return { ...rest, stress: stress + 2 }
    },
    duration: 1
  },
  {
    type: ModifierType.ENERGY,
    affect({ energy, ...rest }: AffectableTraits): AffectableTraits {
      const percentage = 0.2;
      console.log('energy loss...')
      return { ...rest, energy: energy - (energy * percentage) }
    },
    duration: 1
  }
]