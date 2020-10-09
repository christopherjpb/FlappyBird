const sprites = new Image()
sprites.src = './sprites.png'
const soundHit = new Audio()
soundHit.src = './sound/hit.wav'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

let frames = 0

function createBird() {
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
        antiGravidade: 2.3,
        action: [ // movimento das asas
            {sx: 0, sy: 0}, // asa para cima
            {sx: 0, sy: 26}, // asa no meio
            {sx: 0, sy: 52} // asa para baixo
        ],
        frameInicial: 0,
        atualizaFrame() {
            const baterAsasIntervalo = (frames%10) === 0 // bater asas no intervalo de 10 frames
            if (baterAsasIntervalo) {
                bird.frameInicial = (1 + bird.frameInicial)%(bird.action.length) // trocar o bater de asa do "action"
            }
        },
        desenha() {
            bird.atualizaFrame()
            const {sx, sy} = bird.action[bird.frameInicial]
            contexto.drawImage(
                bird.img,
                sx, sy,
                bird.lag, bird.alt,
                bird.x, bird.y,
                bird.lag, bird.alt
            )
        },

        cair() {
            if (bird.y > 364) {
                soundHit.play()
                setTimeout(() => {
                    mudaTela(tela.Start)
                }, 500)
                return
            }

            bird.gravidadeZero = bird.gravidadeZero + bird.gravidade
            bird.y = bird.y + bird.gravidadeZero
        },

        sobe() {
            bird.gravidadeZero = - bird.antiGravidade
        }
    }
    return bird
}

function createGround() {
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

            contexto.drawImage(
                ground.img,
                ground.sx, ground.sy,
                ground.lag, ground.alt,
                ground.x + ground.lag + ground.lag, ground.y,
                ground.lag, ground.alt
            )
        },

        atualiza() {
            ground.x = ground.x - 0.5
            ground.x = (ground.x - 1)%(ground.y / 2)
        }
    }
    return ground
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

const global = {}
let telaAtiva = {}
function mudaTela(novaTela) {
    telaAtiva = novaTela
    if (telaAtiva.initialize) {
        telaAtiva.initialize()
    }
}

const tela = {
    Start: {
        initialize() {
            global.bird = createBird()
            global.ground = createGround()
        },
        desenha() {
            background.desenha()
            global.ground.desenha()
            startReady.desenha()
        },
        click() {
            mudaTela(tela.Game)
        },
        atualiza() {
            global.ground.atualiza()
        }
    },

    Game: {
        desenha() {
            background.desenha()
            global.ground.desenha()
            global.bird.desenha()
        },
        click() {
            global.bird.sobe()
        },
        atualiza() {
            global.bird.cair()
            global.ground.atualiza()
        }
    }
}

function loop() {
    telaAtiva.desenha()
    telaAtiva.atualiza()

    frames += 1
    requestAnimationFrame(loop)
}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaTela(tela.Start)
loop()