import React, { useEffect, useRef, useState, useCallback } from "react";
import useRecorder from "./useRecorder";

const TimerController = (props) => {
    const [renderedStreamDuration, setRenderedStreamDuration] = useState(
        "00:00:00"
    ),
        streamDuration = useRef(0),
        previousTime = useRef(0),
        requestAnimationFrameId = useRef(null),
        [isStartTimer, setIsStartTimer] = useState(false),
        [isStopTimer, setIsStopTimer] = useState(false),
        [isPauseTimer, setIsPauseTimer] = useState(false),
        [isResumeTimer, setIsResumeTimer] = useState(false),
        isStartBtnDisabled = isPauseTimer || isResumeTimer || isStartTimer,
        isStopBtnDisabled = !(isPauseTimer || isResumeTimer || isStartTimer);

    const updateTimer = useCallback(() => {
        let now = performance.now();
        let dt = now - previousTime.current;

        if (dt >= 1000) {
            streamDuration.current = streamDuration.current + Math.round(dt / 1000);
            const formattedStreamDuration = new Date(streamDuration.current * 1000)
                .toISOString()
                .substr(11, 8);
            setRenderedStreamDuration(formattedStreamDuration);
            previousTime.current = now;
        }
        requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
    }, []);

    const startTimer = useCallback(() => {
        previousTime.current = performance.now();
        requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
    }, [updateTimer]);

    useEffect(() => {
        if (props.record === true) {
            startHandler();
        } else {
            stopHandler();
        }
        if (isStartTimer && !isStopTimer) {
            startTimer();
        }
        if (isStopTimer && !isStartTimer) {
            streamDuration.current = 0;
            cancelAnimationFrame(requestAnimationFrameId.current);
            setRenderedStreamDuration("00:00:00");
        }
    }, [isStartTimer, isStopTimer, startTimer, props.record]);

    const startHandler = () => {
        setIsStartTimer(true);
        setIsStopTimer(false);
    };

    const stopHandler = () => {
        setIsStopTimer(true);
        setIsStartTimer(false);
        setIsPauseTimer(false);
        setIsResumeTimer(false);
    };

    return (
        <div className="timer-controller-wrapper">{renderedStreamDuration}s</div>
    );
};

function Mic({getAudio}) {
    const [state, setState] = useState("");
    const [audios, setAudios] = useState([]);
    const [record, setRecord] = useState(false);
    const [play, setPlay] = useState(false);
    let [audioURL, isRecording, startRecording, stopRecording] = useRecorder();
    useEffect(() => {
        if (audios.length <= 0) {
            setAudios([audioURL]);
        } else {
            setAudios([...audios, audioURL]);
        }
        getAudio(audioURL);
    }, [audioURL]);
    

    function Buttonstart() {
        setState("red");
        setRecord(true);
        startRecording();
        
    }
    async function Buttonstop() {
        if (isRecording === true) {
            await stopRecording();
            setState("#4695da");
            setRecord(false);
        } 
        /* else {
            alert("Give permission audio to record");
        } */
    }
    function Deletedata(id) {
        const data = audios.filter((e, index) => {
            return index !== id;
        });
        setAudios(data);
    }
    function stateaudio(e, index) {
        if (e.target.classList.contains("fa-play")) {
            e.target.classList.remove("fa-play");
            e.target.classList.add("fa-pause");
        } else if (e.target.classList.contains("fa-pause")) {
            e.target.classList.remove("fa-pause");
            e.target.classList.add("fa-play");
        }

        var myAudio = document.getElementById(`audioId${index}`);
        return myAudio.paused ? myAudio.play() : myAudio.pause();
    }
    return (
        <div className="Mic">
           
            
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <button
                    className={"btn btn-primary button"}
                    style={{
                        background: state === "" ? "#4695da" : state,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        textAlign:"center",
                        margin: 10
                    }}
                    onClick={() => {
                        Buttonstart();
                        setTimeout(() => Buttonstop(), 500);
                        
                        
                    }} >
                    {record === true ? (
                        
                           
                            <i className="fas fa-stop-circle" style={{height:"1.6rem",width:"1.5rem",display:"flex", justifyContent:"center",
                            flexWrap: "wrap",alignContent: "center"}}></i>
                            
                        
                    ) : (
                        <i className="fas fa-microphone" style={{height:"1.6rem",width:"1.5rem",display:"flex", justifyContent:"center",
                         flexWrap: "wrap",alignContent: "center"}}></i>
                    )}
                </button>
            </div>
        </div>
    );
}
export default Mic;
