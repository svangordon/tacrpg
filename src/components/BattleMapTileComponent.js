import React, { PropTypes } from 'react'
import style from './BattleMapTileComponentStyles.scss'

const _setBackground = (backgroundString) => {
  return {
    backgroundColor: 'red',
    width: '50'
  }
}

const _logger = (value) => {
  console.log('value ==', value)
  return null
}

const BattleMapTileComponent = ({background, border, handleClick, id, unitName}) => (
  <div className={style.root} onClick={handleClick}
    style={{
      backgroundColor: background,
      background: "url(tileset.png) 32px 0",
      // backgroundSize: "224px 1664px",
      border: border,
      height: 16,
      width: 16
    }}
  />

    // <img src="tileset.png"
    //   style={{
    //     objectFit: 'none',
    //     objectPosition: "0 0",
    //     width: '16px',
    //     height: '16px'
    //   }}
    // />
)

BattleMapTileComponent.propTypes = {
  background: PropTypes.string,
  border: PropTypes.string,
  handleClick: PropTypes.func,
  id: PropTypes.string,
  unitName: PropTypes.string
}

export default BattleMapTileComponent
