import {
  ACTION_TICK,
  ACTION_KEY_DOWN,
  ACTION_KEY_UP,
  ACTION_TOUCH_DOWN,
  ACTION_TOUCH_MOVE,
  ACTION_TOUCH_UP,
  GAME_WIDTH,
  GAME_HEIGHT,
  BALL_SIZE,
  BALL_SPEED,
  BALL_CURVE,
  BALL_MAX_VA,
  BALL_INITIAL_ANGLE,
  BAT_OFFSET,
  BAT_WIDTH,
  BAT_HEIGHT,
  BAT_DAMPING,
  PLAYER_KEY_SPEED,
  PLAYER_TOUCH_SPEED,
  COMPUTER_SPEED,
  COMPUTER_ACTION_DISTANCE,
  HOLD_TIME,
  PARTICLE_MIN_SPEED,
  PARTICLE_MAX_SPEED,
  NUM_PARTICLES,
  KEY_UP,
  KEY_DOWN
} from './constants'
import range from 'array-range'
import { makeRandom, dedecimate } from './util'

const initialState = {
  hold: 0,
  ball: {
    x: 0,
    y: 0,
    a: BALL_INITIAL_ANGLE,
    va: 0
  },
  player: {
    y: 0,
    vy: 0
  },
  computer: {
    y: 0,
    vy: 0
  },
  particles: [],
  keys: {},
  touch: null,
  lastTouch: null
}

function makeParticles (x, y, count, seed) {
  const random = makeRandom(seed)
  return range(count).map(() => ({
    x,
    y,
    a: random() * Math.PI * 2,
    v: random() * (PARTICLE_MAX_SPEED - PARTICLE_MIN_SPEED) + PARTICLE_MIN_SPEED,
    color: Math.floor(random() * 0xffffff)
  }))
}

function tickBall (state, dt) {
  // TODO: this function is so messy!!

  const { ball, hold, player, computer } = state
  var { particles } = state

  const vx = Math.cos(ball.a) * BALL_SPEED
  const vy = Math.sin(ball.a) * BALL_SPEED
  var x = ball.x + vx * dt
  var y = ball.y + vy * dt
  var a = ball.a + ball.va * dt
  var va = ball.va

  if (hold > 0) {
    return Object.assign({}, state, {
      hold: hold - dt
    })
  }

  if (x > GAME_WIDTH / 2 + BALL_SIZE / 2) {
    return Object.assign({}, state, {
      hold: HOLD_TIME,
      ball: Object.assign({}, initialState.ball)
    })
  }
  if (x < -GAME_WIDTH / 2 - BALL_SIZE / 2) {
    return Object.assign({}, state, {
      hold: HOLD_TIME,
      ball: Object.assign({}, initialState.ball, {
        a: Math.PI + BALL_INITIAL_ANGLE
      })
    })
  }

  if (y > GAME_HEIGHT / 2 - BALL_SIZE / 2) {
    y = GAME_HEIGHT / 2 - BALL_SIZE / 2
    a = Math.atan2(-vy, vx)
    particles = particles.concat(makeParticles(x, y, NUM_PARTICLES, dedecimate(a)))
  }
  if (y < -GAME_HEIGHT / 2 + BALL_SIZE / 2) {
    y = -GAME_HEIGHT / 2 + BALL_SIZE / 2
    a = Math.atan2(-vy, vx)
    particles = particles.concat(makeParticles(x, y, NUM_PARTICLES, dedecimate(a)))
  }

  if (
    x < -BAT_OFFSET + BAT_WIDTH / 2 + BALL_SIZE / 2 &&
    y > player.y - BAT_HEIGHT / 2 &&
    y < player.y + BAT_HEIGHT / 2 &&
    Math.cos(a) < 0
  ) {
    x = -BAT_OFFSET + BAT_WIDTH / 2 + BALL_SIZE / 2
    a = Math.atan2(vy, -vx)
    va += player.vy * BALL_CURVE
    particles = particles.concat(makeParticles(x, y, NUM_PARTICLES, dedecimate(a)))
  }
  if (
    x > BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2 &&
    y > computer.y - BAT_HEIGHT / 2 &&
    y < computer.y + BAT_HEIGHT / 2 &&
    Math.cos(a) > 0
  ) {
    x = BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2
    a = Math.atan2(vy, -vx)
    va += computer.vy * BALL_CURVE
    particles = particles.concat(makeParticles(x, y, NUM_PARTICLES, dedecimate(a)))
  }

  va = Math.max(Math.min(va, BALL_MAX_VA), -BALL_MAX_VA)

  return Object.assign({}, state, {
    ball: Object.assign({}, ball, {
      x,
      y,
      a,
      va
    }),
    particles
  })
}

function tickPlayer (player, keys, touch, lastTouch, dt) {
  var vy = player.vy
  var y = player.y + vy * dt

  const topY = -GAME_HEIGHT / 2 + BAT_HEIGHT / 2
  if (y < topY) {
    vy = -vy
    y = topY
  }

  const bottomY = GAME_HEIGHT / 2 - BAT_HEIGHT / 2
  if (y > bottomY) {
    vy = -vy
    y = bottomY
  }

  if (keys[KEY_UP] || keys[KEY_DOWN]) {
    if (keys[KEY_UP]) {
      vy -= PLAYER_KEY_SPEED
    }
    if (keys[KEY_DOWN]) {
      vy += PLAYER_KEY_SPEED
    }
  } else if (touch && lastTouch) {
    vy += (touch.y - lastTouch.y) * PLAYER_TOUCH_SPEED
  }

  vy *= BAT_DAMPING * dt

  return Object.assign({}, player, { vy, y })
}

function tickComputer (computer, ball, dt) {
  var vy = computer.vy
  var y = computer.y + vy * dt

  const topY = -GAME_HEIGHT / 2 + BAT_HEIGHT / 2
  if (y < topY) {
    vy = -vy
    y = topY
  }

  const bottomY = GAME_HEIGHT / 2 - BAT_HEIGHT / 2
  if (y > bottomY) {
    vy = -vy
    y = bottomY
  }

  if (Math.cos(ball.a) > 0) {
    if (ball.y < computer.y - COMPUTER_ACTION_DISTANCE) {
      vy -= COMPUTER_SPEED
    }
    if (ball.y > computer.y + COMPUTER_ACTION_DISTANCE) {
      vy += COMPUTER_SPEED
    }
  }

  vy *= BAT_DAMPING * dt

  return Object.assign({}, computer, { vy, y })
}

function tickParticles (particles, dt) {
  return particles
    .map((particle) => {
      const vx = Math.cos(particle.a) * particle.v
      const vy = Math.sin(particle.a) * particle.v
      const x = particle.x + vx * dt
      const y = particle.y + vy * dt

      if (x > GAME_WIDTH / 2 || x < -GAME_WIDTH / 2) {
        return null
      }
      if (y > GAME_HEIGHT / 2 || y < -GAME_HEIGHT / 2) {
        return null
      }

      return Object.assign({}, particle, { x, y })
    })
    .filter((p) => p)
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case ACTION_TICK:
      const newState = Object.assign({}, state, tickBall(state, action.dt))
      return Object.assign({}, newState, {
        player: tickPlayer(
          newState.player,
          newState.keys,
          newState.touch,
          newState.lastTouch,
          action.dt
        ),
        computer: tickComputer(newState.computer, newState.ball, action.dt),
        particles: tickParticles(newState.particles, action.dt)
      })

    case ACTION_KEY_DOWN:
    case ACTION_KEY_UP:
      return Object.assign({}, state, {
        keys: Object.assign({}, state.keys, {
          [action.keyCode]: action.type === ACTION_KEY_DOWN
        })
      })

    case ACTION_TOUCH_DOWN:
      return Object.assign({}, state, {
        touch: { x: action.x, y: action.y }
      })
    case ACTION_TOUCH_MOVE:
      return Object.assign({}, state, {
        touch: { x: action.x, y: action.y },
        lastTouch: state.touch
      })
    case ACTION_TOUCH_UP:
      return Object.assign({}, state, {
        touch: null,
        lastTouch: null
      })

    default:
      return state
  }
}
