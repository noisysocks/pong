export function makeRandom (seed) {
  const mask = 0xffffffff
  var m_w = seed
  var m_z = 987654321
  return function random () {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask
    return (((m_z << 16) + m_w) & mask) / 4294967296 + 0.5
  }
}

export function dedecimate (num) {
  return +num.toString().replace('.', '')
}
