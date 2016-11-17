export const Coords = (width) => {
  // width = width - 1
  return (coords) => {
    let arr = null
    let id = ''
    if (typeof coords === 'number' || typeof coords === 'string') {
      // ex, coords === 23
      return {
        arr: [coords % width, Math.floor(coords / width)],
        id: coords
      }
    } else if (Array.isArray(coords)) {
      return {
        arr: coords,
        id: width * coords[1] + coords[0]
      }
    }
    throw new Error('bad coords input')
  }
}

export const coords = Coords(15)
