import {SelectedChannel} from "./ChatSelection";
import {createSignal, onCleanup, onMount, Show} from "solid-js";

// From https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

interface RaffleParticipant extends SelectedChannel {
    image: HTMLImageElement
    color: RaffleWheelColor
}

export interface IRaffleProps {
    initialSelected: SelectedChannel[]
}

interface RaffleWheelColor {
    color: string
    textColor: string
}

const wheelRotationSpeed = (Math.PI / 10)
const colors: RaffleWheelColor[] = [
    {color: '#E84855', textColor: 'black'},
    {color: '#05C8FF', textColor: 'black'},
    {color: '#F9DC5C', textColor: 'black'},
    {color: '#0BBC61', textColor: 'black'}
]

export function Raffle(props: IRaffleProps) {
    const shuffled = [...props.initialSelected]
    shuffleArray(shuffled)
    const [selected, setSelected] = createSignal<RaffleParticipant[]>(shuffled.map((selected, i) => {
        const image = new Image()
        image.referrerPolicy = 'no-referrer'
        image.src = selected.profilePicture
        return {
            ...selected,
            image,
            color: colors[i % colors.length]
        }
    }))
    const [winner, setWinner] = createSignal<RaffleParticipant>()
    let canvas: HTMLCanvasElement
    let winnerModalTextbox: HTMLInputElement
    let active = true

    let lastFrameTime = Date.now()
    let wheelRotation = 0
    let wheelVelocity = -1

    const nextFrame = () => {
        const ctx = canvas.getContext("2d")
        const dpi = window.devicePixelRatio
        const computedStyle = getComputedStyle(canvas)
        const h = parseFloat(computedStyle.getPropertyValue('height').slice(0, -2)) * dpi
        const w = parseFloat(computedStyle.getPropertyValue('width').slice(0, -2)) * dpi
        canvas.height = h
        canvas.width = w
        const now = Date.now()
        const timeDiff = (now - lastFrameTime) / 1000
        lastFrameTime = now

        const options = selected()
        const anglePer = (Math.PI * 2) / options.length

        if(wheelVelocity === -1) {
            wheelRotation = (wheelRotation + (wheelRotationSpeed * timeDiff)) % (Math.PI * 2)
        } else if(wheelVelocity !== 0) {
            // Further reading https://gamedev.stackexchange.com/a/41917
            // I just want something that looks natural, not necessarily something that's physically correct
            wheelRotation += timeDiff * wheelVelocity
            wheelVelocity *= 0.985

            const winnerIndex = (options.length - Math.floor(((wheelRotation + (anglePer / 2)) % (Math.PI * 2)) / anglePer)) % options.length
            setWinner(options[winnerIndex])

            if(wheelVelocity < 0.01) {
                wheelVelocity = 0
                winnerModalTextbox.checked = true
            }
        }

        const wheelMargin = 10
        const r = (Math.min(h, w) / 2) - wheelMargin

        ctx.save()
        ctx.translate(w/2, h/2)
        ctx.save()
        ctx.rotate(wheelRotation)
        for(let i = 0; i < options.length; i++) {
            const option = options[i]
            ctx.save()
            ctx.rotate(anglePer * i)

            // Wheel segment
            ctx.beginPath()
            ctx.arc(0, 0, r, anglePer / -2, anglePer / 2)
            ctx.lineTo(0, 0)
            ctx.closePath()
            ctx.fillStyle = option.color.color
            ctx.fill()

            // Profile picture
            const imageSize = (r / 5) - (options.length / 2)
            ctx.save()
            ctx.translate((r - 5) + (imageSize * -1), imageSize / -2)
            ctx.beginPath()
            ctx.arc(imageSize / 2, imageSize / 2, imageSize / 2, 2 * Math.PI, 0)
            ctx.clip()
            ctx.drawImage(option.image, 0, 0, imageSize, imageSize)
            ctx.restore()


            // Username text
            const fontSize = (r / 10) - (options.length / 2)
            ctx.font = `bold ${fontSize}px serif`
            ctx.textAlign = 'right'
            ctx.fillStyle = option.color.textColor
            const textRoom = r - imageSize - 10
            ctx.fillText(option.name, textRoom, fontSize / 4, textRoom)

            ctx.restore()
        }
        ctx.restore()

        // Draw triangle
        ctx.save()
        const triangleSize = r / 5
        ctx.translate(r - (triangleSize / 2), 0)
        ctx.beginPath()
        ctx.lineTo(triangleSize, triangleSize)
        ctx.lineTo(triangleSize, -triangleSize)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.restore()

        ctx.restore()

        if(active) {
            requestAnimationFrame(nextFrame)
        }
    }

    onMount(() => {
        nextFrame()
    })
    onCleanup(() => {
        active = false
    })
    const onWheelClick = () => {
        wheelVelocity = 20 + (Math.random() * 5)
    }

    return (
        <>
            <div class="flex items-stretch flex-col h-screen overflow-hidden">
                <h2 class="text-center font-bold text-xl mt-3">
                    <Show when={winner()} fallback={<>Tap to Spin</>}>
                        {winner().name}
                    </Show>
                </h2>

                <input type="checkbox" id="winner-modal" class="modal-toggle" ref={winnerModalTextbox}/>
                <div class="modal">
                    <div class="modal-box">
                        <Show when={winner()}>
                            <div class="flex flex-col items-center">
                                <h3 class="font-bold text-lg">
                                    Congratulations {winner().name}!
                                </h3>
                                {winner().image}
                            </div>
                        </Show>
                        <div class="modal-action">
                            <label for="winner-modal" class="btn">Yay!</label>
                        </div>
                    </div>
                </div>
                <div class="flex-grow">
                    <canvas ref={canvas} class="w-full h-full" onClick={onWheelClick}/>
                </div>
            </div>
        </>
    )
}
