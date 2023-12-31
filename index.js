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
        this.speed = speed
        this.alive = true
        this.body = []
    }

    move() {
        let movable = true
        for (let index = 0; index < walls.length; index++) {
            const wall = walls[index];

            if (checkCollision(wall,
                {
                    ...this, position: {
                        x: this.position.x + this.speed * this.orientation.x,
                        y: this.position.y + this.speed * this.orientation.y
                    }
                })) {
                movable = false
                this.alive = false
                break
            }

            if(checkCollision( {
                ...this, position: {
                    x: this.position.x + this.speed * this.orientation.x,
                    y: this.position.y + this.speed * this.orientation.y
                }
            }, food)){
                this.body.push(new Body({
                    position: {
                        x: player.body[player.body.length - 1].position.x,
                        y: player.body[player.body.length - 1].position.y
                    }
                }))

            food.position.x = getRandomInt(TILE_SIZE + 1, c.canvas.width - (TILE_SIZE + 1 + this.width))
            food.position.y = getRandomInt(TILE_SIZE + 1, c.canvas.height - (TILE_SIZE + 1 + this.height))

            }
        }

        if (movable) {
            this.position.x += this.speed * this.orientation.x
            this.position.y += this.speed * this.orientation.y
            this.body.forEach((part, i) => {
                let ecart
                if (i == 0) {
                    ecart = {
                        x: getMiddle(this).x - getMiddle(part).x,
                        y: getMiddle(this).y - getMiddle(part).y
                    }
                }
                else {
                    ecart = {
                        x: getMiddle(this.body[i - 1]).x - getMiddle(part).x,
                        y: getMiddle(this.body[i - 1]).y - getMiddle(part).y
                    }
                }
                if(i == 5)
                    console.log(ecart)

                if (Math.abs(ecart.x) > part.width || Math.abs(ecart.x) > 0 && Math.abs(ecart.y) != 0) {
                    part.orientation.x = ecart.x / Math.abs(ecart.x)
                }
                else
                    part.orientation.x = 0

                if (Math.abs(ecart.y) > part.height || Math.abs(ecart.y) > 0 && Math.abs(ecart.x) != 0) {
                    part.orientation.y = ecart.y / Math.abs(ecart.y)
                }
                else
                    part.orientation.y = 0



                part.position.x += this.speed * part.orientation.x
                part.position.y += this.speed * part.orientation.y
            });
        }
    }



    draw() {
        this.move()
        if (this.alive)
            c.fillStyle = "green"
        else
            c.fillStyle = "black"

        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        this.body.forEach(part => {
            part.draw()
        });
    }
}

class Body {
    constructor({ position }) {
        this.position = position
        this.width = TILE_SIZE / 2
        this.height = TILE_SIZE / 2
        this.orientation = {
            x: 0,
            y: 0
        }
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
        x: 0,
        y: 0
    },
    speed: 4
})

player.body.push(
    new Body({
        position: {
            x: player.position.x + (player.width / 2 - TILE_SIZE / 4),
            y: player.position.y + (player.height / 2 - TILE_SIZE / 4)
        }
    }))
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


function getMiddle(object) {
    const position = {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2
    }
    return position
}

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
    frames = 0
}, 1000)
