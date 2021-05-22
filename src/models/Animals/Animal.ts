import { v4 as uuid } from 'uuid'
import { clamp } from 'ramda'
import { Location, Direction, Condition, Action } from '../../types';
import { AffectableTraits, Modifier } from '../../types/Modifier';
import { Plant } from '../Plants/Plant'
import { Dehydration, Emaciated, Exhaustion, Hydrated, Hunger, FullStomach } from '../../modifiers'

const btwn0and100 = clamp(0, 100)

export type History = {
  prevAction: Action
  action: Action
  nextAction: Action
}

const decider = {
  SEARCH: 0,
  FLEE: 0,
  DO_NOTHING: 0,
  RUN_TO_TARGET: 0,
  WALK_TO_TARGET: 0,
  CONSUME_TARGET: 0,
  MATE_TARGET: 0,
  ATTACK_TARGET: 0,
}

interface AnimalAttributes {
  // how fast animal ages
  ageRate?: number
  // how long an animal lives
  lifetime?: number
  // how quickly an animal gets hungry
  metabolismRate?: number
  // how quickly it wears down
  energyBurnRate?: number
  // how quickly it becomes thirsty
  thirstRate?: number
}

export class Animal {
  // meta ========================================
  public id = uuid();
  public turns = 0;

  // spacial ========================================
  public location: Location;
  public facing: Direction;
  private targets: Array<Animal|Plant>

  // condition ========================================
  public conditions: Set<Condition> = new Set();
  public diet: Array<Animal | Plant>;
  private lifetime;
  // private history: Action[]
  // 0-100
  public hunger = 0;
  public thirst = 0;
  private stress = 0;
  public energy = 100;

  // traits ========================================
  private ageRate: number;
  public movementSpeed: number;
  private metabolismRate: number;
  private energyBurnRate: number;
  private thirstRate: number;

  // round bools ==================================
  private drankWater = false;
  private ateFood = false;
  public currentAction: Action = Action.NEUTRAL

  // modifiers ========================================
  private modifiers: Modifier[] = [];

  constructor({ ageRate = 0.005, lifetime = 100, metabolismRate = 3, energyBurnRate = 2, thirstRate = 5 }: AnimalAttributes) {
    this.lifetime = lifetime
    this.ageRate = ageRate
    this.metabolismRate = metabolismRate
    this.energyBurnRate = energyBurnRate
    this.thirstRate = thirstRate
  }

  get isAlive(): boolean {
    return !(this.conditions.has(Condition.DEAD));
  }

  get isTired(): boolean {
    return this.energy < 60;
  }

  get isExhausted(): boolean {
    return this.energy < 33.3
  }

  get isStarving(): boolean {
    return this.hunger > 80
  }

  get isThirsty(): boolean {
    return this.thirst > 66.6
  }

  get isHungry(): boolean {
    return this.hunger > 66.6
  }

  get status(): AffectableTraits & { action: Action } {
    return {
      thirst: this.thirst,
      hunger: this.hunger,
      energy: this.energy,
      conditions: this.conditions,
      stress: this.stress,
      action: this.currentAction
    }
  }

  addModifier(mod: Modifier[]): void {
    this.modifiers = this.modifiers.concat(mod)
  }

  clearModifiers(): void {
    this.modifiers = this.modifiers.filter(modifier => modifier.isPermanent || modifier.duration > 0)
  }

  reduceModifiers(): void {
    this.modifiers = this.modifiers.map(mod => ({ ...mod, duration: mod.duration - 1 }))
  }

  age(): void {
    this.lifetime -= this.ageRate;
  }

  increaseThirst(): void {
    this.thirst = btwn0and100(this.thirst + this.thirstRate);
  }

  gainHunger(): void {
    this.hunger = btwn0and100(this.hunger + this.metabolismRate);
  }

  tire(): void {
    this.energy = btwn0and100(this.energy - this.energyBurnRate);
  }

  die(): void {
    this.conditions = new Set<Condition>().add(Condition.DEAD)
  }

  drink(): void {
    console.log('drank water')
    this.currentAction = Action.DRINKING;
    this.drankWater = true
  }

  eat(): void {
    console.log('ate food')
    this.currentAction = Action.EATING;
    this.ateFood = true;
  }

  think(): void {
    
  }

  roundDeduction(): void {
    this.turns++
    this.age();
    this.increaseThirst();
    this.gainHunger();
    this.tire();
  }

  gainModifiers(): void {
    if (this.isThirsty) {
      this.addModifier(Dehydration)
    }

    if (this.isExhausted) {
      this.addModifier(Exhaustion)
    }

    if (this.drankWater) {
      this.addModifier(Hydrated)
    }

    if (this.ateFood) {
      this.addModifier(FullStomach)
    }

    if (this.isHungry) {
      this.addModifier(Hunger)
    }

    if (this.isStarving) {
      this.addModifier(Emaciated)
    }
  }

  applyModifiers(): void {
    const modified = this.modifiers.map(modifier => {
      return modifier.affect({
        conditions: this.conditions,
        hunger: this.hunger,
        thirst: this.thirst,
        stress: this.stress,
        energy: this.energy
      })
    })

    const { conditions, hunger, thirst, stress, energy } = modified.reduce<AffectableTraits>((acc, val) => {
      const newTraits: Partial<AffectableTraits> = {}
      if (val.conditions !== this.conditions) {
        newTraits.conditions = val.conditions
      }

      if (val.hunger !== this.hunger) {
        newTraits.hunger = val.hunger
      }

      if (val.energy !== this.energy) {
        newTraits.energy = val.energy
      }

      if (val.stress !== this.stress) {
        newTraits.stress = val.stress
      }

      if (val.thirst !== this.thirst) {
        newTraits.thirst = val.thirst
      }

      return { ...acc, ...newTraits }
    }, this.status)

    this.conditions = conditions
    this.hunger = clamp(0, 100, hunger);
    this.thirst = clamp(0, 100, thirst);
    this.stress = clamp(0, 100, stress);
    this.energy = clamp(0, 100, energy);

    this.reduceModifiers();
    this.clearModifiers();
  }

  statusCheck(): void {
    if (this.isThirsty) {
      this.conditions.add(Condition.THIRSTY)
    } else {
      this.conditions.delete(Condition.THIRSTY)
    }

    if (this.isHungry) {
      this.conditions.add(Condition.HUNGRY)
    } else {
      this.conditions.delete(Condition.HUNGRY)
    }

    if (this.isTired) {
      this.conditions.add(Condition.TIRED)
    } else {
      this.conditions.delete(Condition.TIRED)
    }

    if (this.isExhausted || this.isStarving) {
      this.conditions.add(Condition.WEAK)
    } else {
      this.conditions.delete(Condition.WEAK)
    }

    if (this.drankWater) {
      this.conditions.add(Condition.HYDRATED)
    } else {
      this.conditions.delete(Condition.HYDRATED)
    }

    if (this.isStarving) {
      this.conditions.add(Condition.STARVING)
    } else {
      this.conditions.delete(Condition.STARVING)
    }

    if (this.ateFood) {
      this.conditions.add(Condition.FULL_STOMACH)
    } else {
      this.conditions.delete(Condition.FULL_STOMACH)
    }
  }

  resetRoundChecks(): void {
    this.drankWater = false;
    this.ateFood = false;
  }

  tick(): void {
    // runtime
    if (this.isAlive) {
      // routine deductions
      console.log('\n round start stats \n', this.status)
      this.roundDeduction()

      this.think()

      this.gainModifiers()
      this.applyModifiers()
      this.statusCheck()
      this.resetRoundChecks()
      if (this.stress === 100) this.die()
      if (this.lifetime === 0) this.die()
    }

  }

}