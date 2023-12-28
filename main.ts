namespace SpriteKind {
    export const Turret = SpriteKind.create()
    export const Indicator = SpriteKind.create()
    export const Launcher = SpriteKind.create()
    export const Barrel = SpriteKind.create()
    export const RocketCalibre = SpriteKind.create()
    export const SmallCalibre = SpriteKind.create()
    export const Explosion = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += -1
    setPlayerTileMapPosition()
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    towerType += 1
    towerType = towerType % 2
    displayTilePlacementIndicator(towerType)
})
function generateBarrel (barrelType: number, targetSprite: Sprite, shootingSprite: Sprite, length: number, steps: number, lifespan: number) {
    if (targetSprite != shootingSprite) {
        for (let index = 0; index <= length; index++) {
            if (index % steps == 0) {
                barrelSprite = sprites.create(barrelSpriteImageList[barrelType], SpriteKind.Barrel)
                barrelSprite.setPosition(shootingSprite.x, shootingSprite.y)
                spriteutils.placeAngleFrom(
                barrelSprite,
                spriteutils.angleFrom(shootingSprite, targetSprite),
                index + steps,
                shootingSprite
                )
                barrelSprite.z = 15
                barrelSprite.lifespan = lifespan
            }
        }
    } else {
        for (let index = 0; index <= length; index++) {
            if (index % steps == 0) {
                barrelSprite = sprites.create(barrelSpriteImageList[barrelType], SpriteKind.Barrel)
                barrelSprite.setPosition(shootingSprite.x, shootingSprite.y - index)
                barrelSprite.z = 15
                barrelSprite.lifespan = lifespan
            }
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    fireRate = 500 - sprites.allOfKind(SpriteKind.Turret).length * 10
    if (tiles.tileAtLocationEquals(playerSprite.tilemapLocation(), assets.tile`transparency16`) && emptyTile) {
        generateTower(towerType)
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
    setPlayerTileMapPosition()
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
    setPlayerTileMapPosition()
})
sprites.onOverlap(SpriteKind.RocketCalibre, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -5
    sprites.destroy(sprite)
    explosionSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Explosion)
    explosionSprite.setPosition(otherSprite.x, otherSprite.y)
    explosionSprite.lifespan = 400
    explosionSprite.setScale(5, ScaleAnchor.Middle)
    animation.runImageAnimation(
    explosionSprite,
    [img`
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
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . 4 . . . . . 
        . . . . 2 . . . . 4 4 . . . . . 
        . . . . 2 4 . . 4 5 4 . . . . . 
        . . . . . 2 4 d 5 5 4 . . . . . 
        . . . . . 2 5 5 5 5 4 . . . . . 
        . . . . . . 2 5 5 5 5 4 . . . . 
        . . . . . . 2 5 4 2 4 4 . . . . 
        . . . . . . 4 4 . . 2 4 4 . . . 
        . . . . . 4 4 . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,img`
        . 3 . . . . . . . . . . . 4 . . 
        . 3 3 . . . . . . . . . 4 4 . . 
        . 3 d 3 . . 4 4 . . 4 4 d 4 . . 
        . . 3 5 3 4 5 5 4 4 d d 4 4 . . 
        . . 3 d 5 d 1 1 d 5 5 d 4 4 . . 
        . . 4 5 5 1 1 1 1 5 1 1 5 4 . . 
        . 4 5 5 5 5 1 1 5 1 1 1 d 4 4 . 
        . 4 d 5 1 1 5 5 5 1 1 1 5 5 4 . 
        . 4 4 5 1 1 5 5 5 5 5 d 5 5 4 . 
        . . 4 3 d 5 5 5 d 5 5 d d d 4 . 
        . 4 5 5 d 5 5 5 d d d 5 5 4 . . 
        . 4 5 5 d 3 5 d d 3 d 5 5 4 . . 
        . 4 4 d d 4 d d d 4 3 d d 4 . . 
        . . 4 5 4 4 4 4 4 4 4 4 4 . . . 
        . 4 5 4 . . 4 4 4 . . . 4 4 . . 
        . 4 4 . . . . . . . . . . 4 4 . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . b b . b b b . . . . . 
        . . . . b 1 1 b 1 1 1 b . . . . 
        . . b b 3 1 1 d d 1 d d b b . . 
        . b 1 1 d d b b b b b 1 1 b . . 
        . b 1 1 1 b . . . . . b d d b . 
        . . 3 d d b . . . . . b d 1 1 b 
        . b 1 d 3 . . . . . . . b 1 1 b 
        . b 1 1 b . . . . . . b b 1 d b 
        . b 1 d b . . . . . . b d 3 d b 
        . b b d d b . . . . b d d d b . 
        . b d d d d b . b b 3 d d 3 b . 
        . . b d d 3 3 b d 3 3 b b b . . 
        . . . b b b d d d d d b . . . . 
        . . . . . . b b b b b . . . . . 
        `],
    100,
    false
    )
    for (let value of spriteutils.getSpritesWithin(SpriteKind.Enemy, 74, otherSprite)) {
        statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, value).value += -15
    }
})
function setPlayerTileMapPosition () {
    playerColumn = playerColumn % 16
    playerRow = playerRow % 16
    if (playerColumn < 0) {
        playerColumn += 16
    }
    if (playerRow < 0) {
        playerRow += 16
    }
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(playerColumn, playerRow))
}
scene.onOverlapTile(SpriteKind.Enemy, sprites.vehicle.roadHorizontal, function (sprite, location) {
    if (!(tiles.tileAtLocationIsWall(location))) {
        sprite.setFlag(SpriteFlag.GhostThroughWalls, false)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += 1
    setPlayerTileMapPosition()
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    playerSprite.sayText("" + playerSprite.tilemapLocation().column + ", " + playerSprite.tilemapLocation().row)
    info.setScore(sprites.allOfKind(SpriteKind.Player).length)
})
sprites.onOverlap(SpriteKind.SmallCalibre, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -3
    sprites.destroy(sprite)
})
function generateProjectile (projectileType: number, targetSprite: Sprite, shootingSprite: Sprite, speed: number) {
    projectile = sprites.create(projectileSpriteImageList[projectileType], projectileSpriteKindList[projectileType])
    projectile.setPosition(shootingSprite.x, shootingSprite.y)
    projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
    projectile.follow(targetSprite, 100)
    projectile.lifespan = 1500
}
function displayTilePlacementIndicator (indicatorType: number) {
    animation.runImageAnimation(
    currentTileIndicatorSprite,
    indicatorSpriteAnimationList[indicatorType],
    150,
    true
    )
}
function generateTower (towerType: number) {
    towerSprite = sprites.create(towerSpriteImageList[towerType], towerSpriteKindList[towerType])
    towerSprite.z = 10
    tiles.placeOnTile(towerSprite, playerSprite.tilemapLocation())
    spriteutils.onSpriteUpdateInterval(towerSprite, towerSpriteUpdatePeriod[towerType], function (sprite) {
        nearbyEnemyList = spriteutils.getSpritesWithin(SpriteKind.Enemy, 50, sprite)
        if (nearbyEnemyList.length > 0) {
            generateProjectile(towerType, nearbyEnemyList[0], sprite, towerSpriteUpdatePeriod[towerType] / 5)
            generateBarrel(towerType, nearbyEnemyList[0], sprite, barrelSpriteSizeList[towerType], 1, towerSpriteUpdatePeriod[towerType] + 1)
        } else {
            generateBarrel(towerType, sprite, sprite, barrelSpriteSizeList[towerType], 1, towerSpriteUpdatePeriod[towerType] + 1)
        }
    })
}
let statusbar: StatusBarSprite = null
let enemySprite: Sprite = null
let nearbyEnemyList: Sprite[] = []
let towerSprite: Sprite = null
let projectile: Sprite = null
let explosionSprite: Sprite = null
let playerColumn = 0
let playerSprite: Sprite = null
let barrelSprite: Sprite = null
let playerRow = 0
let currentTileIndicatorSprite: Sprite = null
let fireRate = 0
let enemySpeed = 0
let emptyTile = false
let towerType = 0
let projectileSpriteKindList: number[] = []
let projectileSpriteImageList: Image[] = []
let indicatorSpriteAnimationList: Image[][] = []
let barrelSpriteSizeList: number[] = []
let barrelSpriteImageList: Image[] = []
let towerSpriteUpdatePeriod: number[] = []
let towerSpriteKindList: number[] = []
let towerSpriteImageList: Image[] = []
towerSpriteImageList = [img`
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
    `, img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . b . . . . . . . . b . . . 
    . . . . b f f . . f f b . . . . 
    . . . . f b b f f b b f . . . . 
    . . . . . b f c c f b . . . . . 
    . . . . . b f c c f b . . . . . 
    . . . . f b b f f b b f . . . . 
    . . . . b f f . . f f b . . . . 
    . . . b . . . . . . . . b . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `]
towerSpriteKindList = [SpriteKind.Turret, SpriteKind.Launcher]
towerSpriteUpdatePeriod = [300, 2500]
barrelSpriteImageList = [img`
    2 
    `, img`
    c c 
    c c 
    `]
barrelSpriteSizeList = [6, 8]
indicatorSpriteAnimationList = [assets.animation`myAnim0`, assets.animation`myAnim1`]
projectileSpriteImageList = [img`
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
    `, img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . b b . . . . . . . 
    . . . . . . . b b . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `]
projectileSpriteKindList = [SpriteKind.SmallCalibre, SpriteKind.RocketCalibre]
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
setPlayerTileMapPosition()
game.onUpdate(function () {
    for (let kindValue of towerSpriteKindList) {
        for (let value of sprites.allOfKind(kindValue)) {
            emptyTile = true
            if (playerSprite.overlapsWith(value)) {
                emptyTile = false
                break;
            }
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
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.SmallCalibre)) {
        if (Math.abs(value.vx) == 0 && Math.abs(value.vy) == 0) {
            sprites.destroy(value)
        }
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
