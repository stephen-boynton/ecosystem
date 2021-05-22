import {Animal} from './models/Animals/Animal'

(() => {
  console.log('Starting ecosystem... Let there be Animals!')
  const manimal = new Animal({});
  console.log('manimal isAlive', manimal.isAlive)
  let rounds = 0
  /* eslint-disable-next-line */
  while(rounds < 50){
    console.log(`ROUND ${rounds}`)
    manimal.tick()
    rounds++
  }
})()