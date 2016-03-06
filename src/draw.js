import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_SCALE,
  BALL_SIZE,
  BAT_OFFSET,
  BAT_WIDTH,
  BAT_HEIGHT,
  PARTICLE_SIZE,
  BG_COLOR,
  FG_COLOR
} from './constants'

function drawRect (ctx, x, y, w, h, a = 0, fillStyle = FG_COLOR) {
  ctx.save()

  ctx.translate(x, y)
  ctx.rotate(a)

  ctx.fillStyle = fillStyle
  ctx.fillRect(-w / 2, -h / 2, w, h)

  ctx.restore()
}

export default function draw (state) {
  const ctx = document.getElementById('pong').getContext('2d')

  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, GAME_WIDTH * GAME_SCALE, GAME_HEIGHT * GAME_SCALE)

  ctx.save()

  ctx.scale(GAME_SCALE, GAME_SCALE)
  ctx.translate(GAME_WIDTH / 2, GAME_HEIGHT / 2)

  state.particles.forEach(particle => drawRect(
    ctx,
    particle.x,
    particle.y,
    PARTICLE_SIZE,
    PARTICLE_SIZE,
    0,
    '#' + particle.color.toString(16)
  ))

  drawRect(ctx, state.ball.x, state.ball.y, BALL_SIZE, BALL_SIZE, state.ball.a)
  drawRect(ctx, -BAT_OFFSET, state.player.y, BAT_WIDTH, BAT_HEIGHT)
  drawRect(ctx, BAT_OFFSET, state.computer.y, BAT_WIDTH, BAT_HEIGHT)

  ctx.restore()
}
