const TILE_SIZE = 32
const RESOLUTION = 1024
const FPS = 60
let frames
let msPrev = window.performance.now()

const canvasPlayground = document.getElementById("playground")
canvasPlayground.width = RESOLUTION
canvasPlayground.height = canvasPlayground.width * 9 / 16
const c = canvasPlayground.getContext("2d")

const canvasBackground = document.getElementById("background")
canvasBackground.width = RESOLUTION
canvasBackground.height = canvasBackground.width * 9 / 16
const bc = canvasBackground.getContext("2d")



class Player {
    constructor({ position, orientation, speed }) {
        this.position = position
        this.width = TILE_SIZE
        this.height = TILE_SIZE
        this.orientation = orientation
        this.width = TILE_SIZE
        this.height = TILE_SIZE
        this.speed = speed
        this.alive = true
        this.body = []
    }

    move() {
        let movable = true
        for (let index = 0; index < walls.length; index++) {
            const wall = walls[index];

            if (checkCollision({...this, position: {
                x: this.position.x += this.speed * this.orientation.x,
                y: this.position.y += this.speed * this.orientation.y
            }}, wall)) {
                movable = false
                this.alive = false
                break
            }

        }
        if (movable) {
            this.position.x += this.speed * this.orientation.x
            this.position.y += this.speed * this.orientation.y
        }
    }

    checkCollision(object) {
        return this.position.x + this.speed * this.orientation.x + TILE_SIZE > object.position.x &&
            this.position.x + this.speed * this.orientation.x < object.position.x + TILE_SIZE &&
            this.position.y + this.speed * this.orientation.y + TILE_SIZE > object.position.y &&
            this.position.y + this.speed * this.orientation.y < object.position.y + TILE_SIZE
    }

    draw() {
        this.move()

        if (this.alive)
            c.fillStyle = "green"
        else
            c.fillStyle = "black"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Body {
    constructor({ position }) {
        this.position = position
        this.width = 2 * TILE_SIZE / 3
        this.height = 2 * TILE_SIZE / 3
    }

    draw() {
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Wall {
    constructor({ position }) {
        this.position = position
        this.width = TILE_SIZE
        this.height = TILE_SIZE
    }

    draw(canvas) {
        canvas.fillStyle = "red"
        canvas.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Food {
    constructor({ position }) {
        this.position = position
        this.width = TILE_SIZE / 2
        this.height = TILE_SIZE / 2
    }

    draw() {
        if (checkCollision(this, player)) {
            player.body.push(new Body({
                position: {
                    x: player.position.x,
                    y: player.position.y
                }
            }))

            this.position.x = getRandomInt(TILE_SIZE + 1, c.canvas.width - (TILE_SIZE + 1))
            this.position.y = getRandomInt(TILE_SIZE + 1, c.canvas.height - (TILE_SIZE + 1))
        }
        c.fillStyle = "olive"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const walls = []
collision.forEach((y, j) => {
    y.forEach((x, i) => {
        if (x)
            walls.push(new Wall({
                position: {
                    x: i * TILE_SIZE,
                    y: j * TILE_SIZE
                }
            }))

    });
});

const player = new Player({
    position: {
        x: canvasPlayground.width / 2 - TILE_SIZE / 2,
        y: canvasPlayground.height / 2 - TILE_SIZE / 2
    },
    orientation: {
        x: 1,
        y: 0
    },
    speed: 4
})

const food = new Food({
    position: {
        x: getRandomInt(TILE_SIZE + 1, c.canvas.width - (TILE_SIZE + 1)),
        y: getRandomInt(TILE_SIZE + 1, c.canvas.height - (TILE_SIZE + 1))
    }
})




bc.fillStyle = "aliceblue"
bc.fillRect(0, 0, bc.canvas.width, bc.canvas.height)

walls.forEach(wall => {
    wall.draw(bc)
});



function frameUpdate() {
    window.requestAnimationFrame(frameUpdate)
    c.clearRect(0, 0, c.canvas.width, c.canvas.height)

    player.draw()
    food.draw()



    msNow = window.performance.now()
    if (msNow - msPrev < 1000 / FPS) return
    msPrev = msNow - (msNow - msPrev) % (1000 / FPS)

    frames++
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    frameUpdate();
}
startAnimating(60);


function checkCollision(object1, object2) {
    return object1.position.x + object1.width > object2.position.x &&
    object1.position.x < object2.position.x + object2.width &&
    object1.position.y + object1.height > object2.position.y &&
    object1.position.y < object2.position.y + object2.height
}

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "z":
            if (player.orientation.y != 1 && player.alive) {
                player.orientation.y = -1
                player.orientation.x = 0
            }
            break

        case "s":
            if (player.orientation.y != -1 && player.alive) {
                player.orientation.y = 1
                player.orientation.x = 0
            }
            break

        case "q":
            if (player.orientation.x != 1 && player.alive) {
                player.orientation.y = 0
                player.orientation.x = -1
            }
            break

        case "d":
            if (player.orientation.x != -1 && player.alive) {
                player.orientation.y = 0
                player.orientation.x = 1
            }
            break
    }
})

function checkCollision(object1, object2) {
    return (object1.position.x + object1.width > object2.position.x &&
        object1.position.x < object2.position.x + object2.width &&
        object1.position.y + object2.height > object2.position.y &&
        object1.position.y < object2.position.y + object2.height)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

window.setInterval(() => {
    //console.log(frames)
    frames = 0
}, 1000)
