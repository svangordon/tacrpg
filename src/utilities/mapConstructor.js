import { basemap } from '../assets/basemap.js'

export const TileGetter = (mapJSON) => { // actually gets a tile's offset
//   console.log(tileId, tileset)
	return (tileId) => {
		const col = tileId % mapJSON.tilesets[0].columns
		const row = Math.floor(tileId / mapJSON.tilesets[0].columns)
		return [col * mapJSON.tilesets[0].tilewidth * -1, row * mapJSON.tilesets[0].tileheight * -1]
	}
}

export const tileGetter = TileGetter(basemap)

export const mapConstructor = (mapJSON) => {
	// TODO: Consider moving this whole thing to syncMap, and running it everytime we sync
	const constructedMap = []
  // add tiles
	for (let i = 0; i < mapJSON.height * mapJSON.width; i++) {
		const tile = {
			layers: {},
			y: Math.floor(i / mapJSON.width),
			x: i % mapJSON.width
		}
		tile.id = i
		for (let k = 0; k < mapJSON.layers.length; k++) {
			// const layerObj = tile.layers
			tile.layers[mapJSON.layers[k].name] = {
				data: mapJSON.layers[k].data[i] - mapJSON.tilesets[0].firstgid,
        name: mapJSON.layers[k].name,
				offset: mapJSON.layers[k].data[i] - mapJSON.tilesets[0].firstgid !== -1 ?	tileGetter(mapJSON.layers[k].data[i] - 1) : null,
				opacity: 1
			}
		}
		// if (i === 82) {
		// 	console.trace('82 ==', tile)
		// }
	constructedMap.push(tile)
	}
	return constructedMap
}

// mapConstructor(basemap)
