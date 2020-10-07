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
    x: 50,
    y: 50,
    gravidadeZero: 0,
    gravidade: 0.08,
    desenha() {
        contexto.drawImage(
            bird.img,
            bird.sx, bird.sy,
            bird.lag, bird.alt,
            bird.x, bird.y,
            bird.lag, bird.alt
        )
    },

    cair() {
        bird.gravidadeZero = bird.gravidadeZero + bird.gravidade
        bird.y = bird.y + bird.gravidadeZero
    }
}

const ground = {
    img: sprites,
    sx: 0,
    sy: 610,
    lag: 224,
    alt: 112,
    x: 0,
    y: 387,
    desenha() {
        contexto.drawImage(
            ground.img,
            ground.sx, ground.sy,
            ground.lag, ground.alt,
            ground.x, ground.y,
            ground.lag, ground.alt
        )

        contexto.drawImage(
            ground.img,
            ground.sx, ground.sy,
            ground.lag, ground.alt,
            ground.x + ground.lag, ground.y,
            ground.lag, ground.alt
        )
    }
}

const background = {
    img: sprites,
    sx: 390,
    sy: 0,
    lag: 276,
    alt: 204,
    x: 0,
    y: 183,
    desenha() {
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            background.img,
            background.sx, background.sy,
            background.lag, background.alt,
            background.x, background.y,
            background.lag, background.alt
        )

        contexto.drawImage(
            background.img,
            background.sx, background.sy,
            background.lag, background.alt,
            background.x + background.lag, background.y,
            background.lag, background.alt
        )
    }
}

const startReady = {
    img: sprites,
    sx: 133,
    sy: 0,
    lag: 176,
    alt: 152,
    x: (canvas.width / 2) - 176 / 2,
    y: (canvas.height / 2) - 152 / 2,
    desenha() {
        contexto.drawImage(
            startReady.img,
            startReady.sx, startReady.sy,
            startReady.lag, startReady.alt,
            startReady.x, startReady.y,
            startReady.lag, startReady.alt
        )
    }
}

let telaAtiva = {}
function mudaTela(novaTela) {
    telaAtiva = novaTela
}

const tela = {
    Start: {
        desenha() {
            background.desenha()
            ground.desenha()
            startReady.desenha()
        },
        click() {
            mudaTela(tela.Game)
        },
        atualiza() {
        }
    },

    Game: {
        desenha() {
            bird.cair()
            background.desenha()
            ground.desenha()
            bird.desenha()
        },
        click() {
        },
        atualiza() {
            //bird.atualiza()
        }
    }
}

function loop() {
    telaAtiva.desenha()
    telaAtiva.atualiza()
    requestAnimationFrame(loop)
}

window.addEventListener('click', function() {
    if (telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaTela(tela.Start)
loop()