namespace SpriteKind {
    export const Turret = SpriteKind.create()
    export const Indicator = SpriteKind.create()
}
function generateLaser (laserType: number, targetSprite: Sprite, shootingSprite: Sprite, length: number, steps: number, lifespan: number) {
    if (targetSprite != shootingSprite) {
        for (let index = 0; index <= length; index++) {
            if (index % steps == 0) {
                barrelSprite = sprites.create(img`
                    2 2 
                    2 2 
                    `, SpriteKind.Food)
                barrelSprite.setPosition(shootingSprite.x, shootingSprite.y)
                spriteutils.placeAngleFrom(
                barrelSprite,
                spriteutils.angleFrom(shootingSprite, targetSprite),
                index,
                shootingSprite
                )
                barrelSprite.z = 15
                barrelSprite.lifespan = lifespan
            }
        }
    } else {
        for (let index = 0; index <= length; index++) {
            if (index % steps == 0) {
                barrelSprite = sprites.create(img`
                    2 2 
                    2 2 
                    `, SpriteKind.Food)
                barrelSprite.setPosition(shootingSprite.x, shootingSprite.y - index)
                barrelSprite.z = 15
                barrelSprite.lifespan = lifespan
            }
        }
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += -1
    setPlayerTileMapPosition(playerColumn, playerRow)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    towerType += 1
    towerType = towerType % 2
    displayTilePlacementIndicator(towerType)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    fireRate = 500 - sprites.allOfKind(SpriteKind.Turret).length * 10
    if (tiles.tileAtLocationEquals(playerSprite.tilemapLocation(), assets.tile`transparency16`) && emptyTile) {
        generateTower(1)
    }
})
function generatePlayer () {
    playerColumn = 4
    playerRow = 5
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
}
scene.onOverlapTile(SpriteKind.Enemy, sprites.dungeon.hazardLava1, function (sprite, location) {
    sprites.destroy(sprite, effects.fire, 100)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    playerColumn += -1
    setPlayerTileMapPosition(playerColumn, playerRow)
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
    setPlayerTileMapPosition(playerColumn, playerRow)
})
function setPlayerTileMapPosition (column: number, row: number) {
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(column % 16, row % 16))
}
scene.onOverlapTile(SpriteKind.Enemy, sprites.vehicle.roadHorizontal, function (sprite, location) {
    if (!(tiles.tileAtLocationIsWall(location))) {
        sprite.setFlag(SpriteFlag.GhostThroughWalls, false)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += 1
    setPlayerTileMapPosition(playerColumn, playerRow)
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    playerSprite.sayText("" + playerSprite.tilemapLocation().column + ", " + playerSprite.tilemapLocation().row)
    info.setScore(sprites.allOfKind(SpriteKind.Player).length)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Turret, function (sprite, otherSprite) {
	
})
function generateProjectile (projectileType: number, targetSprite: Sprite, shootingSprite: Sprite) {
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
    projectile.setPosition(shootingSprite.x, shootingSprite.y)
    projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
    spriteutils.setVelocityAtAngle(projectile, spriteutils.angleFrom(shootingSprite, targetSprite), 200)
    projectile.setFlag(SpriteFlag.AutoDestroy, true)
}
function displayTilePlacementIndicator (indicatorType: number) {
    animation.runImageAnimation(
    currentTileIndicatorSprite,
    indicatorSpriteAnimationList[indicatorType],
    150,
    true
    )
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -10
    sprites.destroy(sprite)
})
function generateTower (towerType: number) {
    towerSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . b b b b . . . . . . 
        . . . . . b b f f b b . . . . . 
        . . . . . b f 2 2 f b . . . . . 
        . . . . . b f 2 2 f b . . . . . 
        . . . . . b b f f b b . . . . . 
        . . . . . . b b b b . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Turret)
    towerSprite.z = 10
    tiles.placeOnTile(towerSprite, playerSprite.tilemapLocation())
    spriteutils.onSpriteUpdateInterval(towerSprite, 500, function (sprite) {
        nearbyEnemyList = spriteutils.getSpritesWithin(SpriteKind.Enemy, 50, sprite)
        if (nearbyEnemyList.length > 0) {
            generateLaser(1, nearbyEnemyList[0], sprite, 5, 1, 510)
            generateProjectile(1, nearbyEnemyList[0], sprite)
        } else {
            generateLaser(1, sprite, sprite, 5, 1, 510)
        }
    })
}
let statusbar: StatusBarSprite = null
let enemySprite: Sprite = null
let nearbyEnemyList: Sprite[] = []
let towerSprite: Sprite = null
let projectile: Sprite = null
let playerSprite: Sprite = null
let playerColumn = 0
let playerRow = 0
let barrelSprite: Sprite = null
let currentTileIndicatorSprite: Sprite = null
let fireRate = 0
let enemySpeed = 0
let emptyTile = false
let towerType = 0
let indicatorSpriteAnimationList: Image[][] = []
indicatorSpriteAnimationList = [assets.animation`myAnim0`, assets.animation`myAnim1`]
towerType = 0
emptyTile = true
enemySpeed = 30
fireRate = 500
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
displayTilePlacementIndicator(0)
currentTileIndicatorSprite.setFlag(SpriteFlag.Invisible, true)
scene.setBackgroundColor(1)
tiles.setCurrentTilemap(tilemap`level1`)
generatePlayer()
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
	
})
