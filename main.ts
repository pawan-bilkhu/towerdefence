namespace SpriteKind {
    export const Turret = SpriteKind.create()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    spriteElementIndex += 1
    spriteElementIndex = spriteElementIndex % sprites.allOfKind(SpriteKind.Enemy).length
    scene.cameraFollowSprite(sprites.allOfKind(SpriteKind.Enemy)[spriteElementIndex])
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tiles.tileAtLocationEquals(playerSprite.tilemapLocation(), assets.tile`transparency16`)) {
        towerSprite = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . 4 . . . . . . . 
            . . . . . . . . 4 . . . . . . . 
            . . . . . f f f 4 f f f . . . . 
            . . . . . f f f 4 f f f . . . . 
            . . . . . f f f 4 f f f . . . . 
            . . . . . f f f 4 f f f . . . . 
            . . . . . f f f f f f f . . . . 
            . . . . . f f f f f f f . . . . 
            . . . . . f f f f f f f . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Turret)
        tiles.placeOnTile(towerSprite, playerSprite.tilemapLocation())
    }
    fireRate = 1000 - sprites.allOfKind(SpriteKind.Turret).length * 10
})
scene.onOverlapTile(SpriteKind.Enemy, sprites.dungeon.hazardLava1, function (sprite, location) {
    sprites.destroy(sprite, effects.fire, 100)
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    sprites.destroy(status.spriteAttachedTo())
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn2)) {
        sprite.setVelocity(0, 100)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn4)) {
        sprite.setVelocity(-100, 0)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn1)) {
        sprite.setVelocity(0, 100)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn3)) {
        sprite.setVelocity(100, 0)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadIntersection3)) {
        if (Math.percentChance(50)) {
            sprite.setVelocity(-100, 0)
            sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
        } else {
            sprite.setVelocity(0, 100)
        }
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadIntersection4)) {
        sprite.setVelocity(0, 100)
    }
})
scene.onOverlapTile(SpriteKind.Enemy, sprites.vehicle.roadHorizontal, function (sprite, location) {
    if (!(tiles.tileAtLocationIsWall(location))) {
        sprite.setFlag(SpriteFlag.GhostThroughWalls, false)
    }
})
spriteutils.onSpriteKindUpdateInterval(SpriteKind.Turret, 500, function (sprite) {
	
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
})
let projectile: Sprite = null
let nearbyEnemyList: Sprite[] = []
let statusbar: StatusBarSprite = null
let enemySprite: Sprite = null
let towerSprite: Sprite = null
let playerSprite: Sprite = null
let spriteElementIndex = 0
let fireRate = 0
fireRate = 500
spriteElementIndex = 0
playerSprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . f . . . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . f 1 1 1 f . . . . . . 
    . . . . f 1 1 1 1 1 f . . . . . 
    . . . f 1 1 1 1 1 1 1 f . . . . 
    . . f 1 1 1 1 1 1 1 1 1 f . . . 
    . . f 1 1 1 1 1 1 1 1 1 f . . . 
    . . . f f f f 1 f f f f . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . . . f . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Player)
controller.moveSprite(playerSprite)
playerSprite.setFlag(SpriteFlag.GhostThroughWalls, true)
scene.cameraFollowSprite(playerSprite)
scene.setBackgroundColor(1)
tiles.setCurrentTilemap(tilemap`level1`)
game.onUpdateInterval(1000, function () {
    enemySprite = sprites.create(img`
        ........................
        ........................
        ........................
        ........................
        ..........ffff..........
        ........ff1111ff........
        .......fb111111bf.......
        .......f11111111f.......
        ......fd11111111df......
        ......fd11111111df......
        ......fddd1111dddf......
        ......fbdbfddfbdbf......
        ......fcdcf11fcdcf......
        .......fb111111bf.......
        ......fffcdb1bdffff.....
        ....fc111cbfbfc111cf....
        ....f1b1b1ffff1b1b1f....
        ....fbfbffffffbfbfbf....
        .........ffffff.........
        ...........fff..........
        ........................
        ........................
        ........................
        ........................
        `, SpriteKind.Enemy)
    tiles.placeOnRandomTile(enemySprite, assets.tile`myTile`)
    enemySprite.setVelocity(53, 0)
    statusbar = statusbars.create(20, 4, StatusBarKind.EnemyHealth)
    statusbar.max = 100
    statusbar.attachToSprite(enemySprite)
})
forever(function () {
    pause(fireRate)
})
forever(function () {
    info.setScore(0)
})
game.onUpdateInterval(500, function () {
    for (let value of sprites.allOfKind(SpriteKind.Turret)) {
        nearbyEnemyList = spriteutils.getSpritesWithin(SpriteKind.Enemy, 50, value)
        if (nearbyEnemyList.length > 1) {
            projectile = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . 4 4 . . . . . . . 
                . . . . . . 4 5 5 4 . . . . . . 
                . . . . . . 2 5 5 2 . . . . . . 
                . . . . . . . 2 2 . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.Projectile)
            projectile.setPosition(value.x, value.y)
            projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
            spriteutils.setVelocityAtAngle(projectile, spriteutils.angleFrom(value, nearbyEnemyList[0]), 200)
        }
    }
})
