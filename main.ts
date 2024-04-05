namespace SpriteKind {
    export const ZigZaggers = SpriteKind.create()
    export const Snake = SpriteKind.create()
    export const Treasure = SpriteKind.create()
    export const Bombs = SpriteKind.create()
    export const Effects = SpriteKind.create()
}
function BOOM (bomb: Sprite) {
    timer.after(bomb_prime_time, function () {
        for (let x = 0; x <= 4; x++) {
            for (let y = 0; y <= 4; y++) {
                tiles.setTileAt(tiles.getTileLocation(tiles.locationXY(tiles.locationOfSprite(bomb), tiles.XY.column) - 2 + x, tiles.locationXY(tiles.locationOfSprite(bomb), tiles.XY.row) - 2 + y), assets.tile`transparency8`)
                tiles.setWallAt(tiles.getTileLocation(tiles.locationXY(tiles.locationOfSprite(bomb), tiles.XY.column) - 2 + x, tiles.locationXY(tiles.locationOfSprite(bomb), tiles.XY.row) - 2 + y), false)
            }
        }
        for (let value of spriteutils.getSpritesWithin(SpriteKind.Player, 32, bomb)) {
            scene.cameraShake(4, 500)
            lives += -1
            game_over_check()
        }
        for (let value of spriteutils.getSpritesWithin(SpriteKind.Snake, 32, bomb)) {
            value.destroy()
            net_worth += 50
        }
        bomb.destroy()
        for (let index = 0; index < 10; index++) {
            new_effect = sprites.create(img`
                5 4 
                2 5 
                `, SpriteKind.Effects)
            spriteutils.placeAngleFrom(
            new_effect,
            0,
            0,
            bomb
            )
            spriteutils.setVelocityAtAngle(new_effect, spriteutils.degreesToRadians(randint(0, 360)), randint(30, 200))
            new_effect.lifespan = 300
            new_effect.setFlag(SpriteFlag.DestroyOnWall, true)
        }
        BombAm += -1
    })
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStarted) {
        if (Wilson.isHittingTile(CollisionDirection.Bottom)) {
            spriteutils.jumpImpulse(Wilson, 18)
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Snake, function (sprite, otherSprite) {
    if (0 < sprite.vy && sprite.y < otherSprite.bottom) {
        otherSprite.destroy()
        spriteutils.jumpImpulse(sprite, 26)
        net_worth += sprites.readDataNumber(otherSprite, "value")
    } else {
        if (sprites.readDataBoolean(sprite, "attacking")) {
            otherSprite.destroy()
            net_worth += sprites.readDataNumber(otherSprite, "value")
        } else {
            timer.throttle("damage", damage_cooldown_time, function () {
                controller.moveSprite(sprite, 0, 0)
                sprite.vx = 0
                spriteutils.setVelocityAtAngle(sprite, spriteutils.angleFrom(otherSprite, sprite), 100)
                lives += -1
                game_over_check()
                pause(damage_cooldown_time)
                controller.moveSprite(sprite, sprite_move_speed, 0)
            })
        }
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStarted && BombAm < 2) {
        BombAm += 1
        bomb = sprites.create(img`
            f c c f 
            c c b c 
            c c c c 
            f c c f 
            `, SpriteKind.Bombs)
        spriteutils.placeAngleFrom(
        bomb,
        0,
        0,
        Wilson
        )
        bomb.startEffect(effects.warmRadial, bomb_prime_time)
        bomb.ay = GRAVITY
        BOOM(bomb)
    }
})
spriteutils.createRenderable(100, function (screen2) {
    spriteutils.drawTransparentImage(img`
        . . f . f . . 
        . f 2 f 2 f . 
        f 2 2 2 2 2 f 
        f e 2 2 2 2 f 
        . f e 2 2 f . 
        . . f e f . . 
        . . . f . . . 
        `, screen2, 1, 1)
    throwaway_text.setText("x" + lives)
    throwaway_text.setOutline(1, 15)
    throwaway_text.setMaxFontHeight(5)
    spriteutils.drawTransparentImage(throwaway_text.image, screen2, 9, 1)
    throwaway_text.setText("" + net_worth)
    spriteutils.drawTransparentImage(throwaway_text.image, screen2, 25, 1)
    throwaway_text.setText("LVL" + depth_level)
    spriteutils.drawTransparentImage(throwaway_text.image, screen2, 160 - throwaway_text.width - 1, 1)
})
function game_over_check () {
    if (lives <= 0) {
        game.over(false)
    }
}
function get_tile_image (col: number, row: number) {
    if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Left), assets.tile`transparency8`) && tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Top), assets.tile`transparency8`)) {
        return assets.tile`tile12`
    } else if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Right), assets.tile`transparency8`) && tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Top), assets.tile`transparency8`)) {
        return assets.tile`tile9`
    } else if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Right), assets.tile`transparency8`) && tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Bottom), assets.tile`transparency8`)) {
        return assets.tile`tile7`
    } else if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Left), assets.tile`transparency8`) && tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Bottom), assets.tile`transparency8`)) {
        return assets.tile`tile13`
    } else if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Left), assets.tile`transparency8`)) {
        return assets.tile`tile14`
    } else if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Top), assets.tile`transparency8`)) {
        return assets.tile`tile10`
    } else if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Right), assets.tile`transparency8`)) {
        return assets.tile`tile6`
    } else if (tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Bottom), assets.tile`transparency8`)) {
        return assets.tile`tile8`
    } else {
        if (rng.percentChance(4)) {
            return assets.tile`tile5`
        } else if (rng.percentChance(2)) {
            return assets.tile`tile11`
        } else {
            return assets.tile`tile4`
        }
    }
}
function CreateStuffs () {
    for (let value of tiles.getTilesByType(assets.tile`transparency8`)) {
        if (rng.percentChance(1)) {
            new_snake = sprites.create(img`
                . . . . . . . . 
                . . . . . . . . 
                . . . . . . . . 
                . . . . . . . . 
                7 7 . . . . . . 
                f 7 7 . . . . . 
                . 6 7 7 . 7 7 7 
                . . 6 7 7 6 6 6 
                `, SpriteKind.Snake)
            tiles.placeOnTile(new_snake, value)
            new_snake.ay = GRAVITY
            new_snake.vx = rng.randomElement([-1, 1]) * 10
            sprites.setDataNumber(new_snake, "value", 50)
        } else if (rng.percentChance(1)) {
            new_treasure = sprites.create(img`
                . . . . . . . 
                . . . . . . . 
                . . . . . . . 
                . . . . . . . 
                . . 5 4 1 . . 
                . . 4 4 4 . . 
                . 5 5 4 5 1 . 
                2 2 4 4 4 5 1 
                `, SpriteKind.Treasure)
            tiles.placeOnTile(new_treasure, value)
            new_treasure.ay = GRAVITY
            sprites.setDataNumber(new_treasure, "value", 100)
        }
    }
}
scene.onOverlapTile(SpriteKind.ZigZaggers, assets.tile`tile4`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency8`)
    if (rng.percentChance(1)) {
        make_a_room(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row), 10, 6)
    } else if (rng.percentChance(5)) {
        offshoot_bricklayer = sprites.create(img`
            f c f c f c f c 
            c a b b b b a f 
            f b b b b b b c 
            c b b b b b b f 
            f b b b b b b c 
            c b b b b b b f 
            f a b b b b a c 
            c f c f c f c f 
            `, SpriteKind.ZigZaggers)
        tiles.placeOnTile(offshoot_bricklayer, location)
        offshoot_bricklayer.setVelocity(rng.randomElement([-1, 1]) * rng.randomRange(80, 100), 0)
        offshoot_bricklayer.lifespan = 1000
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStarted) {
        characterAnimations.setCharacterAnimationsEnabled(Wilson, false)
        sprites.setDataBoolean(Wilson, "attacking", true)
        if (characterAnimations.matchesRule(Wilson, characterAnimations.rule(Predicate.FacingRight))) {
            animation.runImageAnimation(
            Wilson,
            [img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . 2 2 . . . . . . 
                . 2 . . 2 . . . . . 
                2 . . 2 2 2 . . . . 
                7 . . 2 2 2 2 . . . 
                . . . 2 1 f 2 2 . . 
                . . . 2 2 2 4 . . . 
                . . . 2 2 2 2 . . . 
                . . . . 2 2 . . . . 
                `,img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . 2 2 . . . . . . 
                . 2 . . 2 . . . . . 
                2 . . 2 2 2 . . . . 
                7 . . 2 2 2 2 . . . 
                . . . 2 1 f 2 2 4 . 
                . . . 2 2 2 4 4 . . 
                . . . 2 2 2 2 . . . 
                . . . . 2 2 . . . . 
                `,img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . 2 2 . . . . . . 
                . 2 . . 2 . . . . . 
                2 . . 2 2 2 . . . . 
                7 . . 2 2 2 2 . . . 
                . . . 2 1 f 2 2 4 . 
                . . . 2 2 2 4 5 . . 
                . . . 2 2 2 2 4 5 . 
                . . . 2 . . 2 . . . 
                `,img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . 2 2 . . . . . . 
                . 2 . . 2 . . . . . 
                2 . . 2 2 2 . . . . 
                7 . . 2 2 2 2 . . . 
                . . . 2 1 f 2 2 . . 
                . . . 2 2 2 2 5 . . 
                . . . 2 2 2 2 4 . . 
                . . . 2 . . 2 . . . 
                `],
            100,
            false
            )
        } else {
            animation.runImageAnimation(
            Wilson,
            [img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . . . . . 2 2 . . 
                . . . . . 2 . . 2 . 
                . . . . 2 2 2 . . 2 
                . . . 2 2 2 2 . . 7 
                . . 2 2 f 1 2 . . . 
                . . . 4 2 2 2 . . . 
                . . . 2 2 2 2 . . . 
                . . . . 2 2 . . . . 
                `,img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . . . . . 2 2 . . 
                . . . . . 2 . . 2 . 
                . . . . 2 2 2 . . 2 
                . . . 2 2 2 2 . . 7 
                . . 2 2 f 1 2 . . . 
                . . 4 4 2 2 2 . . . 
                . . . 2 2 2 2 . . . 
                . . . 2 . . 2 . . . 
                `,img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . . . . . 2 2 . . 
                . . . . . 2 . . 2 . 
                . . . . 2 2 2 . . 2 
                . . . 2 2 2 2 . . 7 
                . 4 2 2 f 1 2 . . . 
                . . 5 4 2 2 2 . . . 
                . 5 4 2 2 2 2 . . . 
                . . . 2 . . 2 . . . 
                `,img`
                . . . . . . . . . . 
                . . . . . . . . . . 
                . . . . . . 2 2 . . 
                . . . . . 2 . . 2 . 
                . . . . 2 2 2 . . 2 
                . . . 2 2 2 2 . . 7 
                . . 2 2 f 1 2 . . . 
                . . 5 4 2 2 2 . . . 
                . . 4 2 2 2 2 . . . 
                . . . 2 . . 2 . . . 
                `],
            100,
            false
            )
        }
        pause(400)
        sprites.setDataBoolean(Wilson, "attacking", false)
        characterAnimations.setCharacterAnimationsEnabled(Wilson, true)
    }
})
function generate_new_level () {
    for (let value of sprites.allOfKind(SpriteKind.Snake)) {
        sprites.destroy(value)
    }
    for (let value of sprites.allOfKind(SpriteKind.Treasure)) {
        sprites.destroy(value)
    }
    gameStarted = false
    level = tiles.createSmallMap(tilemap`level3`)
    tiles.loadMap(level)
    for (let col = 0; col <= tiles.tilemapColumns() - 1; col++) {
        for (let row = 0; row <= tiles.tilemapRows() - 1; row++) {
            tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`tile4`)
        }
    }
    top_of_level_door = tiles.getTileLocation(6, 5)
    rng = Random.createRNG(randint(10, 1000000))
    height_of_room = rng.randomRange(3, 7)
    width_of_room = rng.randomRange(7, 10)
    make_a_room(tiles.locationXY(top_of_level_door, tiles.XY.column) - width_of_room / 2, tiles.locationXY(top_of_level_door, tiles.XY.row) - height_of_room / 2, width_of_room, height_of_room)
    tiles.setTileAt(top_of_level_door, assets.tile`myTile1`)
    bricklayer = sprites.create(img`
        f c f c f c f c 
        c a b b b b a f 
        f b b b b b b c 
        c b b b b b b f 
        f b b b b b b c 
        c b b b b b b f 
        f a b b b b a c 
        c f c f c f c f 
        `, SpriteKind.ZigZaggers)
    tiles.placeOnTile(bricklayer, top_of_level_door)
    bricklayer.setBounceOnWall(true)
    bricklayer.setVelocity(rng.randomElement([-1, 1]) * rng.randomRange(150, 200), 80)
    scene.cameraFollowSprite(bricklayer)
}
function make_a_room (left: number, top: number, width: number, height: number) {
    for (let col = 0; col <= width - 1; col++) {
        for (let row = 0; row <= height - 1; row++) {
            tiles.setTileAt(tiles.getTileLocation(left + col, top + row), assets.tile`transparency8`)
        }
    }
}
scene.onHitWall(SpriteKind.ZigZaggers, function (sprite, location) {
    if (!(spriteutils.isDestroyed(sprite)) && sprite.isHittingTile(CollisionDirection.Bottom)) {
        sprite.destroy()
        end_room_height = 6
        make_a_room(tiles.locationXY(location, tiles.XY.column) - 4, tiles.locationXY(location, tiles.XY.row) - end_room_height, 10, end_room_height)
        tiles.setTileAt(tiles.locationInDirection(location, CollisionDirection.Top), assets.tile`myTile0`)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile0`, function (sprite, location) {
    gameStarted = false
    depth_level += 1
    sprite.destroy()
    generate_new_level()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Treasure, function (sprite, otherSprite) {
    otherSprite.destroy()
    net_worth += sprites.readDataNumber(otherSprite, "value")
})
scene.onHitWall(SpriteKind.Snake, function (sprite, location) {
    if (gameStarted) {
        if (sprite.isHittingTile(CollisionDirection.Right) || sprite.isHittingTile(CollisionDirection.Left)) {
            sprite.vx = sprite.vx * -1
            if (sprite.vx < 0) {
                sprite.x += -1
            } else {
                sprite.x += 1
            }
        }
    }
})
let end_room_height = 0
let bricklayer: Sprite = null
let width_of_room = 0
let height_of_room = 0
let top_of_level_door: tiles.Location = null
let level: tiles.WorldMap = null
let offshoot_bricklayer: Sprite = null
let new_treasure: Sprite = null
let new_snake: Sprite = null
let rng: FastRandomBlocks = null
let Wilson: Sprite = null
let gameStarted = false
let BombAm = 0
let new_effect: Sprite = null
let bomb: Sprite = null
let bomb_prime_time = 0
let damage_cooldown_time = 0
let sprite_move_speed = 0
let lives = 0
let depth_level = 0
let net_worth = 0
let GRAVITY = 0
let throwaway_text: TextSprite = null
scene.setBackgroundImage(img`
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddbbbbbdddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddbbbbbbbbbbb1bbbbbb11111111111111bbbbbddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddd11111111bbbbbb111111111111111bbbb111111111dddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddd11111111111bbbbbb111111111111111bbb1111111111ddd1111ddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddd111111111111bbbbbb111111111111111bbb1111111111dd1111111ddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddd111111111111bbbbbb111111111111111bbb11111111111d11111111dddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbdbbbbbdddddddd1111111111111bbbbbb111111111111111bb111111111111d11111111ddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbddbbbbbddddddddd111111111111bbbbbbb11d11111111111bb111111111111d11111111ddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbdddbbbbdddddddddd111111111111bbbbbbb1dd111111b1111bb11111111111111111111dddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbddddbbbbddddddddddd11111111111bbbbbbb1ddd11111b11111b11111111111111111111dddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbdddddbbbddddddddddddddd1111111bbbbbbb1ddd11111b11111111111111111111111111dddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbdddddbbddddddddddddddddddddd11bbbbbbbdddd11111bb1111111111111111111111111dddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbdddddbbdddddddddddddddddddddddbbbbbbbdddd11111bb11111111111111111111ddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbddddddbbdddddddddddddddddddddddbbbbbbbddddddddbbbbddddddddddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbdddddddbdddddddddddddddddddddddbbbbbbbbdddddddbbbbddddddddddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbdddddddbdddddddddddddddddddddddbbbbbbbbdddddddbbbbbddddddddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbdddddddddddddddddddddddddddddddbbbbbbbbdddddddbbbbbdddbddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbbdddddddbbbbbdddbbddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbdddddddddddddddbbbbddddddddddbbbbbbbbbbdddddddbbbbbdddbbddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbddddddddddddddbbbbbbbbdddddbbbbbbbbbbbbddddddbbbbbdddbbbddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbdddddddddddddbbbbbbbbbbbbddbbbbbbbbbbbbdddddbbbbbbbddbbbdddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddbbbbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbdddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddbbbbbbbdddbbbbbddbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddbbbbdddbbbbbbdddddddddddddddbbbbbbbdddbbbbddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddbbbbdddbbbbbddddddddddddddddbbbbbbbdddbbbbdddddbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddbbbbddddbbbbddddddddddddddddbbbbbbbddddbbbdddddbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddddddbbbbddddbbbdddddddddddddddddbbbbbbbddddbbddddddbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddddddddddddbbbbddd1bbb11dddddddddddddddbbbbbbbddddbbddddddbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddd1111bbbb1111bb111dddd1111dddddddbbbbbbbddddbbdddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddddddd11111bbbb1111bb111ddd111111111ddbbbbbbbbddddbbdddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddd1111bbbbb1111b1111ddd11111111111bbbbbbbbddddbbdddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddd1111bbbbb1111b1111dd111111111111bbbbbbbbddddbddddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddddddd111bbbbb1111b1111d1111111111111bbbbbbbbdddddddddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddbddddd1bbbbb1111b1111d1111111111111bbbbbbbbdddddddddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddbddddd1bbbbb11111111111111111111111bbbbbbbbdddddddddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddbdddbbdddddbbbbbbb1111111111111111111111bbbbbbbbdddddddddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddbdddbbdddddbbbbbbb111111111111111111111bbbbbbbbbdddddddddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbddbbbdddddbbbbbbb111111111111111111111bbbbbbbbb1ddddddddddbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbdddddbbbbbbb111111111111111111111bbbbbbbbb1dddddbdddbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbddddbbbbbbbb1111111d111111111111bbbbbbbbbb11ddddbbdbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbddddbbbbbbbb111111dd111111111111bbbbbbbbbb11ddddbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddbbbbbbbbd11111dd111111111111bbbbbbbbbbddddddbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddbbbbbbbbbbdd11dddd11111111111bbbbbbbbbbddddddbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddbbbbbbbbbbdddddddd11111111111bbbbbbbbbbddddddbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbbbbbbbbddddddddd1111111111bbbbbbbbbbddddddbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddd1111111bbbbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddbbbbbbbbbbbbbdddbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddbbbbddbbbbdddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddbbbddbbbbdddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddbbddddbbbdddddbbbbbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddbbddddbbbdddddbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddd1ddbbddddbbddddddbbbbbbbbdddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddd111111b11111bbddddddbbbbbbbbddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddd11111111b11111bb1dddddbbbbbbbbdddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddd111111111111111bb11ddddbbbbbbbbddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddd1111111111111111b111ddddbbbbbbbbdddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddd11111111111111111111dddddbbbbbbbdddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddd111111111d111111111dddddbbbbbbbdddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddd111111dd11111111ddddddbbbbbbbdddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddd1111dd111111ddddddddbbbbbbbbdddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddd11ddd11dddddddddddbbbbbbbbddddbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbddddbbdddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddddddddddddddbbbbbbbbddddbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddddddddddddddbddbbbbbbbbbdddbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddddddddddddddbddbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddddddddddddddbddbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdddddddddddbdddddddddbbdbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddddbdddddddddbbdbbbbbbbbbbdddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddbdddddddddbbdbbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddbbddddddddbbbbbbbbbbbbbddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddbbbddddddddbbbdbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbddddddddbbbdbbbbbbbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    `)
throwaway_text = textsprite.create("", 0, 1)
throwaway_text.setFlag(SpriteFlag.Invisible, true)
GRAVITY = 500
net_worth = 0
depth_level = 1
lives = 4
sprite_move_speed = 80
damage_cooldown_time = 1200
bomb_prime_time = 3000
generate_new_level()
/**
 * TODAY TODO
 * 
 * - LEDGE HANGING
 */
/**
 * TODO LIST:
 * 
 * - Drills? maybe? if we dont cover it up, or a loading screen
 * 
 * - Space out embedded treasure more aesthetically
 * 
 * - the deeper you go, the deeper you are
 * 
 * - Fix the snake Stack overflow
 * 
 * - BOMBS
 * 
 * - ROPES
 * 
 * - LEDGE HANGING
 */
game.onUpdate(function () {
    if (!(gameStarted) && 0 == sprites.allOfKind(SpriteKind.ZigZaggers).length) {
        for (let value of sprites.allOfKind(SpriteKind.Snake)) {
            sprites.destroy(value)
        }
        gameStarted = true
        for (let value of tiles.getTilesByType(assets.tile`tile4`)) {
            tiles.setWallAt(value, true)
            tiles.setTileAt(value, get_tile_image(tiles.locationXY(value, tiles.XY.column), tiles.locationXY(value, tiles.XY.row)))
        }
        Wilson = sprites.create(img`
            . . . . . . . . . . 
            . . 2 2 . . . . . . 
            . 2 . . 2 . . . . . 
            2 . . 2 2 2 . . . . 
            7 . . 2 2 2 2 . . . 
            . . . 2 1 f 2 2 . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 . . 2 . . . 
            `, SpriteKind.Player)
        tiles.placeOnTile(Wilson, top_of_level_door)
        scene.cameraFollowSprite(Wilson)
        controller.moveSprite(Wilson, sprite_move_speed, 0)
        Wilson.ay = GRAVITY
        CreateStuffs()
        characterAnimations.loopFrames(
        Wilson,
        [img`
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . 2 2 . . . . . . 
            . 2 . . 2 . . . . . 
            2 . . 2 2 2 . . . . 
            7 . . 2 2 2 2 . . . 
            . . . 2 1 f 2 2 . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 . . 2 . . . 
            `,img`
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . 2 2 . . . . . . 
            . 2 . . 2 . . . . . 
            2 . . 2 2 2 . . . . 
            7 . . 2 2 2 2 . . . 
            . . . 2 1 f 2 2 . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . . 2 2 . . . . 
            `],
        100,
        characterAnimations.rule(Predicate.MovingRight)
        )
        characterAnimations.loopFrames(
        Wilson,
        [img`
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . 2 2 . . 
            . . . . . 2 . . 2 . 
            . . . . 2 2 2 . . 2 
            . . . 2 2 2 2 . . 7 
            . . 2 2 f 1 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 . . 2 . . . 
            `,img`
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . 2 2 . . 
            . . . . . 2 . . 2 . 
            . . . . 2 2 2 . . 2 
            . . . 2 2 2 2 . . 7 
            . . 2 2 f 1 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . . 2 2 . . . . 
            `],
        100,
        characterAnimations.rule(Predicate.MovingLeft)
        )
        characterAnimations.loopFrames(
        Wilson,
        [img`
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . 2 2 . . 
            . . . . . 2 . . 2 . 
            . . . . 2 2 2 . . 2 
            . . . 2 2 2 2 . . 7 
            . . 2 2 f 1 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 . . 2 . . . 
            `],
        100,
        characterAnimations.rule(Predicate.NotMoving, Predicate.FacingLeft)
        )
        characterAnimations.loopFrames(
        Wilson,
        [img`
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . 2 2 . . . . . . 
            . 2 . . 2 . . . . . 
            2 . . 2 2 2 . . . . 
            7 . . 2 2 2 2 . . . 
            . . . 2 1 f 2 2 . . 
            . . . 2 2 2 2 . . . 
            . . . 2 2 2 2 . . . 
            . . . 2 . . 2 . . . 
            `],
        100,
        characterAnimations.rule(Predicate.NotMoving, Predicate.FacingRight)
        )
    }
})
