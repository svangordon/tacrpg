import React, { PropTypes } from 'react'


// Soon, this is going to be generic for both attr & status
const LayerComponent = ({offset, opacity, spriteScale}) => {
  if (offset) {
    // console.log(spriteScale)
    return (
      <div
      style={{
        backgroundImage: "url('tilesetScaled.png')",
        backgroundPosition: offset.map(offset => Number(offset)*Number(spriteScale)+'px').join(' '),
        height: 16 * Number(spriteScale),
        opacity: opacity,
        position: 'absolute',
        width: 16 * Number(spriteScale)
      }}
      />
    )
  }
  return null
}

LayerComponent.propTypes = {
  data: PropTypes.object,
  offset: PropTypes.array,
  opacity: PropTypes.number,
  spriteScale: PropTypes.number,
  title: PropTypes.string
}

export default LayerComponent
