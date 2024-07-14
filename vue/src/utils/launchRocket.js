import anime from "animejs";

//status:{0: onTheGround,1: onTheFlight,2: executing}
let status = 0


const launchRocket = () => {

    const start = ()=>{
            //rotate and expend the rocket
            if (status !== 0){return}

            status = 1

            anime({
                targets: "#rocket",
                keyframes: [
                    {rotate: "-0.13turn",scale: 2},
                    {translateX: 200,translateY: -200},
                ],
                duration: 2000,
                easing: "easeInOutSine"
            })

            anime({
                targets: "#description",
                keyframes: [
                    {scale: 1.5,translateY: -35}
                ],
                delay: 1500,
                duration: 500,
                easing: "easeInOutSine"
            })

            setTimeout(()=>{

                status = 2
            },2000)



    }
    const stop =()=>{

        if (status !== 2){return}
        status = 1
        anime({
            targets: "#rocket",
            keyframes: [
                {translateX: -1,translateY: 1},
                {rotate: "0.001turn",scale: 1},
            ],
            duration: 1000,
            easing: "easeInOutSine"
        })
        anime({
            targets: "#description",
            keyframes: [
                {scale: 1,translateY: 1}
            ],
            delay: 1000,
            duration: 500,
            easing: "easeInOutSine"
        })
        setTimeout(()=>{
            status = 0
        },1500)
    }
    return {start,stop,status}
}
export default launchRocket