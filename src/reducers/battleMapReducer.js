// import { MAP_ACTIONS } from '../actions/actions'

// const tilePrototype = {
//   id: 0, //number
//   position: [],
//   unit: null, // or else the id of the unit
//   tileSkin: 'white', // probably a string that's rehydrated to by an image orwhatever
//   impassable: 0, //1 for impassable
//   terrainType: 'clear' // or, in theory, other types
// }

const initialState = {
  show: true,
  data: [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,0,0],
    [0,1,0,0,0],
    [0,0,0,0,0]
  ],
  height: 5,
  width:5
}

function battleMapReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}

export default battleMapReducer
