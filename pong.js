/*
 * TODO: 
 * - split shit (esp. draw()) out into functions
 * - mobile support
 * - clean up the tick functions
 * - run standard
 * - ship it
 */

var GAME_WIDTH = 600
var GAME_HEIGHT = 400
var GAME_SCALE = 2

var BALL_SIZE = 20
var BALL_SPEED = 400
var BALL_CURVE = 0.002
var BALL_MAX_VA = 2
var BALL_INITIAL_ANGLE = Math.PI / 9

var BAT_OFFSET = GAME_WIDTH / 2 - 20
var BAT_WIDTH = 10
var BAT_HEIGHT = 70
var BAT_DAMPING = 57

var PLAYER_SPEED = 40
var COMPUTER_SPEED = 20
var COMPUTER_ACTION_DISTANCE = 25

var HOLD_TIME = 2

var PARTICLE_SIZE = 2
var PARTICLE_MIN_SPEED = 100
var PARTICLE_MAX_SPEED = 300
var NUM_PARTICLES = 200

var KEY_UP = 38
var KEY_DOWN = 40

var BG_COLOR = '#fff'
var FG_COLOR = '#666'

var initialState = {
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
  keys: {}
}

function makeRandom (seed) {
  var m_w = seed
  var m_z = 987654321
  var mask = 0xffffffff
  return function () {
      m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask
      m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask
      var result = ((m_z << 16) + m_w) & mask
      result /= 4294967296
      return result + 0.5
  }
}

function dedecimate (num) {
  return +num.toString().replace('.', '')
}

function makeParticles(x, y, count, seed) {
  var random = makeRandom(seed)
  var particles = []
  while (count-- > 0) {
    particles.push({
      x: x,
      y: y,
      a: random() * Math.PI * 2,
      v: random() * (PARTICLE_MAX_SPEED - PARTICLE_MIN_SPEED) + PARTICLE_MIN_SPEED,
      color: Math.floor(random() * 0xffffff)
    })
  }
  return particles
}

function tickBall(state, dt) {
  var vx = Math.cos(state.ball.a) * BALL_SPEED
  var vy = Math.sin(state.ball.a) * BALL_SPEED
  var x = state.ball.x + vx * dt
  var y = state.ball.y + vy * dt
  var a = state.ball.a + state.ball.va * dt
  var va = state.ball.va
  var particles = state.particles
  if (state.hold > 0) {
    return Object.assign({}, state, {
      hold: state.hold - dt
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
    //x > -BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2 &&
    y > state.player.y - BAT_HEIGHT / 2 &&
    y < state.player.y + BAT_HEIGHT / 2 &&
    Math.cos(a) < 0
  ) {
    x = -BAT_OFFSET + BAT_WIDTH / 2 + BALL_SIZE / 2
    a = Math.atan2(vy, -vx)
    va += state.player.vy * BALL_CURVE
    particles = particles.concat(makeParticles(x, y, NUM_PARTICLES, dedecimate(a)))
  }
  if (
    x > BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2 &&
    //x < BAT_OFFSET + BAT_WIDTH / 2 + BALL_SIZE / 2 &&
    y > state.computer.y - BAT_HEIGHT / 2 &&
    y < state.computer.y + BAT_HEIGHT / 2 &&
    Math.cos(a) > 0
  ) {
    x = BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2
    a = Math.atan2(vy, -vx)
    va += state.computer.vy * BALL_CURVE
    particles = particles.concat(makeParticles(x, y, NUM_PARTICLES, dedecimate(a)))
  }
  va = Math.max(Math.min(va, BALL_MAX_VA), -BALL_MAX_VA)
  return Object.assign({}, state, {
    ball: Object.assign({}, state.ball, {
      x: x,
      y: y,
      a: a,
      va: va
    }),
    particles: particles
  })
}

function tickPlayer(state, keys, dt) {
  var vy = state.vy
  var y = state.y + vy * dt
  if (y < -GAME_HEIGHT / 2 + BAT_HEIGHT / 2) {
    y = -GAME_HEIGHT / 2 + BAT_HEIGHT / 2
    vy = -vy
  }
  if (y > GAME_HEIGHT / 2 - BAT_HEIGHT / 2) {
    y = GAME_HEIGHT / 2 - BAT_HEIGHT / 2
    vy = -vy
  }
  if (keys[KEY_UP]) {
    vy -= PLAYER_SPEED
  }
  if (keys[KEY_DOWN]) {
    vy += PLAYER_SPEED
  }
  vy *= BAT_DAMPING * dt
  return Object.assign({}, state, {
    y: y,
    vy: vy
  })
}

function tickComputer(state, ballState, dt) {
  var vy = state.vy
  var y = state.y + vy * dt
  if (y < -GAME_HEIGHT / 2 + BAT_HEIGHT / 2) {
    y = -GAME_HEIGHT / 2 + BAT_HEIGHT / 2
    vy = -vy
  }
  if (y > GAME_HEIGHT / 2 - BAT_HEIGHT / 2) {
    y = GAME_HEIGHT / 2 - BAT_HEIGHT / 2
    vy = -vy
  }
  if (
    Math.cos(ballState.a) > 0 &&
    ballState.y < state.y - COMPUTER_ACTION_DISTANCE
  ) {
    vy -= COMPUTER_SPEED
  }
  if (
    Math.cos(ballState.a) > 0 &&
    ballState.y > state.y + COMPUTER_ACTION_DISTANCE
  ) {
    vy += COMPUTER_SPEED
  }
  vy *= BAT_DAMPING * dt
  return Object.assign({}, state, {
    y: y,
    vy: vy
  })
}

function tickParticles (state, dt) {
  var particles = []
  state.forEach(function (particle) {
    var vx = Math.cos(particle.a) * particle.v
    var vy = Math.sin(particle.a) * particle.v
    var x = particle.x + vx * dt
    var y = particle.y + vy * dt
    if (x > GAME_WIDTH / 2 || x < -GAME_WIDTH / 2) {
      return
    }
    if (y > GAME_HEIGHT / 2 || y < -GAME_HEIGHT / 2) {
      return
    }
    particles.push(Object.assign({}, particle, {
      x: x,
      y: y
    }))
  })
  return particles
}

function reducer (state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  switch (action.type) {
    case 'tick':
      var state = Object.assign({}, state, tickBall(state, action.dt))
      return Object.assign({}, state, {
        player: tickPlayer(state.player, state.keys, action.dt),
        computer: tickComputer(state.computer, state.ball, action.dt),
        particles: tickParticles(state.particles, action.dt),
      })

    case 'keyUp':
    case 'keyDown':
        var prop = {}
        prop[action.keyCode] = action.type === 'keyDown'
        return Object.assign({}, state, {
          keys: Object.assign({}, state.keys, prop)
        })

    default:
      return state
  }
}

function draw (state) {
  var ctx = document.getElementById('pong').getContext('2d') 

  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, GAME_WIDTH * GAME_SCALE, GAME_HEIGHT * GAME_SCALE)

  ctx.save()
  ctx.scale(GAME_SCALE, GAME_SCALE)
  ctx.translate(GAME_WIDTH / 2, GAME_HEIGHT / 2)

  state.particles.forEach(function (particle) {
    ctx.fillStyle = '#' + particle.color.toString(16)
    ctx.fillRect(particle.x - PARTICLE_SIZE / 2, particle.y - PARTICLE_SIZE / 2, PARTICLE_SIZE, PARTICLE_SIZE)
  })

  ctx.save()
  ctx.translate(state.ball.x, state.ball.y)
  ctx.rotate(state.ball.a)
  ctx.fillStyle = FG_COLOR
  ctx.fillRect(-BALL_SIZE / 2, -BALL_SIZE / 2, BALL_SIZE, BALL_SIZE)
  ctx.restore()

  ctx.fillStyle = FG_COLOR
  ctx.fillRect(-BAT_OFFSET - BAT_WIDTH / 2, state.player.y - BAT_HEIGHT / 2, BAT_WIDTH, BAT_HEIGHT)

  ctx.fillStyle = FG_COLOR
  ctx.fillRect(BAT_OFFSET - BAT_WIDTH / 2, state.computer.y - BAT_HEIGHT / 2, BAT_WIDTH, BAT_HEIGHT)

  ctx.restore()
}

var store = Redux.createStore(reducer)

function tick () {
  var dt = (new Date() - lastTime) / 1000
  lastTime = new Date()

  store.dispatch({ type: 'tick', dt: dt })
  draw(store.getState())

  window.requestAnimationFrame(tick)
}

var lastTime = new Date()
window.requestAnimationFrame(tick)

window.addEventListener('keydown', function (e) {
  store.dispatch({ type: 'keyDown', keyCode: e.keyCode })
})
window.addEventListener('keyup', function (e) {
  store.dispatch({ type: 'keyUp', keyCode: e.keyCode })
})
