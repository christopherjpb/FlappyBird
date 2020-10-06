const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

const bird = {
    img: sprites,
    sx: 0,
    sy: 0,
    lag: 34,
    alt: 24,
    x: 100,
    y: 100,
    desenha() {
        contexto.drawImage(
            bird.img,
            bird.sx, bird.sy,
            bird.lag, bird.alt,
            bird.x, bird.y,
            bird.lag, bird.alt,
        )
    }
}

const ground = {
    img: sprites,
    sx: 0,
    sy: 0,
    lag: 34,
    alt: 24,
    x: 100,
    y: 100,
    desenha() {
        contexto.drawImage(
            bird.img,
            bird.sx, bird.sy,
            bird.lag, bird.alt,
            bird.x, bird.y,
            bird.lag, bird.alt,
        )
    }
}

function loop() {
    bird.desenha()
    requestAnimationFrame(loop)
}

loop()