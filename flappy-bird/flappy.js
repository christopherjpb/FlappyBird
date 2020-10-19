const sprites = new Image()
sprites.src = './img/sprites.png'
const soundHit = new Audio()
soundHit.src = './sound/hit.wav'
const soundCaiu = new Audio()
soundCaiu.src = './sound/caiu.wav'
const soundPoint = new Audio()
soundPoint.src = './sound/ponto.wav'
const soundPulo = new Audio()
soundPulo.src = './sound/pulo.wav'


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
            { sx: 0, sy: 0 }, // asa para cima
            { sx: 0, sy: 26 }, // asa no meio
            { sx: 0, sy: 52 } // asa para baixo
        ],
        frameInicial: 0,
        atualizaFrame() {
            const baterAsasIntervalo = (frames % 10) === 0 // bater asas no intervalo de 10 frames
            if (baterAsasIntervalo) {
                bird.frameInicial = (1 + bird.frameInicial) % (bird.action.length) // trocar o bater de asa do "action"
            }
        },
        desenha() {
            bird.atualizaFrame()
            const { sx, sy } = bird.action[bird.frameInicial]
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
                soundCaiu.play()
                setTimeout(() => {
                    mudaTela(tela.Start)
                }, 500)
                return
            }
            bird.gravidadeZero = bird.gravidadeZero + bird.gravidade
            bird.y = bird.y + bird.gravidadeZero
        },

        sobe() {
            soundPulo.play()
            if (bird.y - bird.alt < 1) {
                setTimeout(() => {
                    mudaTela(tela.Start)
                }, 500)
                return
            }
            bird.gravidadeZero = - bird.antiGravidade
            bird.y = bird.y + bird.gravidadeZero
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
        y: 388,
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
            ground.x = (ground.x - 0.5) % (ground.y / 2)
        }
    }
    return ground
}

function createBackGround() {
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
    return background
}

function createTube() {
    const tube = {
        img: sprites,
        lag: 52,
        alt: 400,
        up: {
            sx: 52,
            sy: 169,
        },
        down: {
            sx: 0,
            sy: 169,
        },
        tubeUpDown: [// intervalo da altura dos canos ao subirem e decerem
            //1, // normal
            2, // baixo
            3, // meio
            4, // cima
            //5, // alto
        ],
        tubeInterval: [// intervalo de um par de canos e outro
            1.5,
            1.6,
            1.7,
            1.8,
            1.9,
            2
        ],
        desenha() {
            tube.pares.forEach(function (par) {
                const spaceTube = 65 //* (Math.random() + 1)
                const yRandom = par.y //-58

                const xCeu = par.x
                const yCeu = yRandom
                contexto.drawImage(
                    tube.img,
                    tube.up.sx, tube.up.sy,
                    tube.lag, tube.alt,
                    xCeu, yCeu,
                    tube.lag, tube.alt
                )

                const xChao = par.x
                const yChao = tube.alt + spaceTube + yRandom
                contexto.drawImage(
                    tube.img,
                    tube.down.sx, tube.down.sy,
                    tube.lag, tube.alt,
                    xChao, yChao,
                    tube.lag, tube.alt
                )

                par.tubeSky = {
                    x: xCeu,
                    y: tube.alt + yCeu
                }

                par.tubeFoot = {
                    x: xChao,
                    y: yChao
                }
            })
        },
        impactBird(par) {
            const headbird = global.bird.y
            const footbird = global.bird.y + global.bird.alt

            if (global.bird.x >= par.x) {
                if (headbird <= par.tubeSky.y) {
                    console.log('Cano de Cima')
                    soundHit.play()
                    return true
                }
                if (footbird >= par.tubeFoot.y) {
                    console.log('Cano de Baixo')
                    soundHit.play()
                    return true
                }
            }
            return false
        },
        pares: [],
        atualiza() {
            const tempoDosFrames = frames % 128 === 0
            if (tempoDosFrames) {
                const z = tube.tubeUpDown[Math.floor(Math.random() * tube.tubeUpDown.length)]
                tube.pares.push({
                    x: canvas.width,
                    y: -58 * (Math.random() + z),
                })

            }
            tube.pares.forEach(function (par) {
                const k = tube.tubeInterval[Math.floor(Math.random() * tube.tubeInterval.length)]
                par.x = par.x - k

                if (tube.impactBird(par)) {
                    mudaTela(tela.Start)
                }

                if (par.x + tube.lag <= 0) {
                    tube.pares.shift()
                }
            })
        }
    }
    return tube
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
            global.background = createBackGround()
            global.ground = createGround()
            global.tube = createTube()
        },
        desenha() {
            global.background.desenha()
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
            global.background.desenha()
            global.tube.desenha()
            global.ground.desenha()
            global.bird.desenha()
        },
        click() {
            global.bird.sobe()
        },
        atualiza() {
            global.bird.cair()
            global.tube.atualiza()
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

// window.addEventListener('click', function () {
//     if (telaAtiva.click) {
//         telaAtiva.click()
//     }
// })

window.addEventListener('keypress', (e) => {
    if (e.code == 'Space' || telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaTela(tela.Start)
loop()