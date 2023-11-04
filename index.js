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
        this.orientation = orientation
        this.speed = speed
        this.alive = true
    }

    move() {
        let movable = true
        for (let index = 0; index < walls.length; index++) {
            const wall = walls[index];

            if (this.checkCollision(wall)) {
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
        c.fillRect(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE)
    }
}

class Wall {
    constructor({ position }) {
        this.position = position
    }

    draw(canvas) {
        canvas.fillStyle = "red"
        canvas.fillRect(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE)
    }
}

class Food {

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
    speed: 5
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



    msNow = window.performance.now();

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

window.setInterval(() => {
    console.log(frames)
    frames = 0
}, 1000)
