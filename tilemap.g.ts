// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level1":
            case "level1":return tiles.createTilemap(hex`100010000000000000000000000000000000000001030303030303030303030303030305000000000000000000000000000000060000000000000000000000000000000600000000000000000000000000000006070303030303030302030303030303090600000000000000060000000000000006000000000000000600000000000000060000000000000006000000000000000600000000000000060000000000000008030303030303030400000000000000000000000000000006000000000000000000000000000000060000000000000000000000000000000600000000000000000000000000000006000000000000000000000000000000080303030303030a`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
. . . . . . . . . . . . . . . . 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
. . . . . . . 2 . . . . . . . . 
. 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
. 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
. 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
. 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
. . . . . . . . . 2 2 2 2 2 2 2 
2 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
2 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
2 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
2 2 2 2 2 2 2 2 . 2 2 2 2 2 2 2 
2 2 2 2 2 2 2 2 . . . . . . . . 
`, [myTiles.transparency16,myTiles.tile1,sprites.vehicle.roadIntersection3,sprites.vehicle.roadHorizontal,sprites.vehicle.roadIntersection4,sprites.vehicle.roadTurn2,sprites.vehicle.roadVertical,sprites.vehicle.roadTurn1,sprites.vehicle.roadTurn3,sprites.vehicle.roadTurn4,sprites.dungeon.hazardLava1], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "myTile":
            case "tile1":return tile1;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
