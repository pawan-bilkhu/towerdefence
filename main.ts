namespace SpriteKind {
    export const Turret = SpriteKind.create()
    export const Indicator = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += -1
    setPlayerTileMapPosition(1, 1)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (true) {
        animation.runImageAnimation(
        currentTileIndicatorSprite,
        assets.animation`myAnim1`,
        150,
        true
        )
    } else {
        spriteElementIndex += 1
        spriteElementIndex = spriteElementIndex % sprites.allOfKind(SpriteKind.Enemy).length
        scene.cameraFollowSprite(sprites.allOfKind(SpriteKind.Enemy)[spriteElementIndex])
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    fireRate = 500 - sprites.allOfKind(SpriteKind.Turret).length * 10
    if (tiles.tileAtLocationEquals(playerSprite.tilemapLocation(), assets.tile`transparency16`) && emptyTile) {
        towerSprite = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 6 . . 6 . . . . . . 
            . . . . . . . a a . . . . . . . 
            . . . . . . . a a . . . . . . . 
            . . . . . . 6 . . 6 . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Turret)
        towerSprite.z = 10
        tiles.placeOnTile(towerSprite, playerSprite.tilemapLocation())
        spriteutils.onSpriteUpdateInterval(towerSprite, fireRate, function (sprite) {
            barrelSprite = sprites.create(img`
                . . . . 
                . 3 3 . 
                . 3 3 . 
                . . . . 
                `, SpriteKind.Food)
            barrelSprite.lifespan = fireRate + 5
            barrelSprite.setPosition(sprite.x, sprite.y)
            barrelSprite.z = 15
            nearbyEnemyList = spriteutils.getSpritesWithin(SpriteKind.Enemy, 50, sprite)
            if (nearbyEnemyList.length > 0) {
                spriteutils.placeAngleFrom(
                barrelSprite,
                spriteutils.angleFrom(sprite, nearbyEnemyList[0]),
                2,
                sprite
                )
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
                projectile.setPosition(sprite.x, sprite.y)
                projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
                spriteutils.setVelocityAtAngle(projectile, spriteutils.angleFrom(sprite, nearbyEnemyList[0]), 200)
                projectile.setFlag(SpriteFlag.AutoDestroy, true)
            }
        })
    }
})
scene.onOverlapTile(SpriteKind.Enemy, sprites.dungeon.hazardLava1, function (sprite, location) {
    sprites.destroy(sprite, effects.fire, 100)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    playerColumn += -1
    setPlayerTileMapPosition(1, 1)
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    sprites.destroy(status.spriteAttachedTo())
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn2)) {
        sprite.setVelocity(0, enemySpeed)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn4)) {
        sprite.setVelocity(enemySpeed * -1, 0)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn1)) {
        sprite.setVelocity(0, enemySpeed)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn3)) {
        sprite.setVelocity(enemySpeed, 0)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadIntersection3)) {
        if (Math.percentChance(50)) {
            sprite.setVelocity(enemySpeed * -1, 0)
            sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
        } else {
            sprite.setVelocity(0, enemySpeed)
        }
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadIntersection4)) {
        sprite.setVelocity(0, enemySpeed)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    playerColumn += 1
    setPlayerTileMapPosition(1, 1)
})
function setPlayerTileMapPosition (column: number, row: number) {
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(playerColumn % 16, playerRow % 16))
}
scene.onOverlapTile(SpriteKind.Enemy, sprites.vehicle.roadHorizontal, function (sprite, location) {
    if (!(tiles.tileAtLocationIsWall(location))) {
        sprite.setFlag(SpriteFlag.GhostThroughWalls, false)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += 1
    setPlayerTileMapPosition(1, 1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Turret, function (sprite, otherSprite) {
	
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -10
    sprites.destroy(sprite)
})
let statusbar: StatusBarSprite = null
let enemySprite: Sprite = null
let projectile: Sprite = null
let nearbyEnemyList: Sprite[] = []
let barrelSprite: Sprite = null
let towerSprite: Sprite = null
let playerSprite: Sprite = null
let currentTileIndicatorSprite: Sprite = null
let spriteElementIndex = 0
let fireRate = 0
let enemySpeed = 0
let playerRow = 0
let playerColumn = 0
let emptyTile = false
emptyTile = true
playerColumn = 4
playerRow = 5
enemySpeed = 30
fireRate = 500
spriteElementIndex = 0
currentTileIndicatorSprite = sprites.create(img`
    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
    `, SpriteKind.Indicator)
animation.runImageAnimation(
currentTileIndicatorSprite,
assets.animation`myAnim0`,
150,
true
)
currentTileIndicatorSprite.setFlag(SpriteFlag.Invisible, true)
playerSprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . f . . . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . f 1 1 1 f . . . . . . 
    . . . . f 1 1 1 1 1 f . . . . . 
    . . . . . f f 1 f f . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . . f 1 f . . . . . . . 
    . . . . . . . f . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Player)
playerSprite.z = 50
playerSprite.setFlag(SpriteFlag.GhostThroughWalls, true)
scene.cameraFollowSprite(playerSprite)
scene.setBackgroundColor(1)
tiles.setCurrentTilemap(tilemap`level1`)
setPlayerTileMapPosition(4, 5)
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Turret)) {
        emptyTile = true
        if (playerSprite.overlapsWith(value)) {
            emptyTile = false
            break;
        }
    }
})
game.onUpdate(function () {
    if (playerSprite.tileKindAt(TileDirection.Center, assets.tile`transparency16`) && emptyTile) {
        tiles.placeOnTile(currentTileIndicatorSprite, playerSprite.tilemapLocation())
        currentTileIndicatorSprite.setFlag(SpriteFlag.Invisible, false)
    } else {
        currentTileIndicatorSprite.setFlag(SpriteFlag.Invisible, true)
    }
})
game.onUpdateInterval(2000, function () {
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
    info.setScore(0)
})
