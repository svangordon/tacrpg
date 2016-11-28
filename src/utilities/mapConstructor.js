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
	const firstgid = mapJSON.tilesets[0].firstgid // this will break when we add more tilesets
	for (let i = 0; i < mapJSON.height * mapJSON.width; i++) {
		const tile = {
			id: i,
			layers: {},
			y: Math.floor(i / mapJSON.width),
			x: i % mapJSON.width
		}
		// loop over all layers and add
		for (let k = 0; k < mapJSON.layers.length; k++) {
			// const layerObj = tile.layers
			const layer = mapJSON.layers[k]
			// const layerName = layer.name
			const tileData = layer.data[i] - firstgid
			let terrainType
			try {
				const terrainTypeIndex = tileData !== -1 ? mapJSON.tilesets[0].tiles[tileData]
					.terrain.find(terrainType => terrainType !== -1)
				: null
				terrainType = mapJSON.tilesets[0].terrains[terrainTypeIndex]
			} catch (e) {
				terrainType = null
			}
			tile.layers[layer.name] = {
				data: layer.data[i] - firstgid,
        name: layer.name,
				offset: layer.data[i] - firstgid !== -1 ?	tileGetter(mapJSON.layers[k].data[i] - 1) : null,
				opacity: 1,
				terrainType
			}
			try {
				const baseLayer = tile.layers[layer.name].terrainType.baseLayer
				tile.layers.base = {
					data: tile.layers[layer.name].terrainType.baseLayer,
					name: 'base',
					offset: tileGetter(baseLayer),
					opacity: 1
				}
			} catch (e) {
				console.log('thrown')
			}
			// if (tile.layers[layer.name].terrainType.baseLayer !== -1) {
			// 	tile.layers.base = {
			// 		data: tile.layers[layer.name].terrainType.baseLayer,
			// 		name: 'base',
			// 		offset: tileGetter(mapJSON.layers[k].data[i])
			// 	}
			// }
		}
		// if (i === 82) {
		// 	console.trace('82 ==', tile)
		// }
	constructedMap.push(tile)
	}
	return constructedMap
}

// mapConstructor(basemap)
