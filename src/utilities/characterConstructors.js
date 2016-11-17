import { tileGetter } from './mapConstructor'
import { basemap } from '../assets/basemap'

let n = -1


const knightData = {
  name: "knight",
  label: "Knight",
  owner: 0,
  // position: 80,
  sprite: 114,
  range: 1
}

const spearmanData = {
  name: "spearman",
  label: "Spearman",
  owner: 0,
  // position: 82,
  sprite: 113,
  range: 1
}

const horseData = {
  name: "horse",
  label: "Horse",
  owner: 1,
  // position: 98,
  sprite: 110,
  range: 2
}

const unitFactory = (unitData) => {
  return (position) => {
    n++
    return Object.assign({}, unitData, {
      id: n,
      offset: tileGetter(unitData.sprite),
      moved: false,
      move: 3,
      hp: 10,
      position
    })
  }
}

export const knightMaker = unitFactory(knightData)

export const horseMaker = unitFactory(horseData)

export const spearmanMaker = unitFactory(spearmanData)

// {altLayout.map(cur => (
//   <div key={cur.i}>
//     <BattleMapTileComponent
//       background={this._getTileBackground(cur)}
//       border={this._checkAttackRange(cur)}
//       handleClick={this._handleClickTile.bind(this, this._getUnits(cur.i), [cur.x, cur.y], this._checkActiveMoveTile(cur), cur)}
//       id={cur.i}
//       unitName={this._getUnits(cur.i) && this._getUnits(cur.i).name || ''}
//     />
//   </div>
// ))}
