import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Mic from './Mic';
import { Message } from './Message';
import axios, {isCancel, AxiosError} from 'axios';

const socket = io('http://localhost:8000/', {
  path: '/sockets',
});

export const Chat = (props) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [audioset, setAudioset] = useState([]);
  const [id, setId] = useState([]);
  const lang = {"en":"English",
    "hi":"Hindi",
    "bn":"Bengali",
    "fr":"French"};
  function getAudio (audioURL){
    console.log(audioset, audioURL.data)
    const found = audioset.some(el => el.data === audioURL.data);
    if(audioURL != "" && !found){
      if (audioset.length <= 0) {
        setAudioset([audioURL]);
    } else {
        setAudioset([...audioset, audioURL]);
    }
    uploadVoice(audioURL);
    }
    
    
  }

  async function uploadVoice(audioURL) {
    const audioBlob = await fetch(audioURL.data).then((r) => r.blob());
    const audiofile = new File([audioBlob], "audiofile.webm", {
      type: "audio/webm",
    });
    const formData = new FormData();
    formData.append("file", audiofile);
    formData.append("username", props.profile.name);
    formData.append("source_language",props.profile.data);
    //formData.append("source_language","en");

    await axios.post(
      "http://13.200.37.225:7000/api/123/audio",
      formData,
      {
        "content-type": "multipart/form-data",
      }
    ).then(function (response){
      console.log(response);
    }).catch(function(error){
      console.log(error)
    });
  }


  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(socket.connected);
    });

    socket.on('disconnect', () => {
      setIsConnected(socket.connected);
    });

    socket.on('join', (data) => {
      setMessages((prevMessages) => [...prevMessages, { ...data, type: 'join' }]);
    });

    socket.on('chat', (data) => {
      setMessages((prevMessages) => [...prevMessages, { ...data, type: 'chat' }]);
    });
    function updateAudio(data){
      /* console.log(audioset, data);
      if (audioset.length <= 0) {
        setAudioset([data]);
    } else {
        setAudioset([...audioset,data]);
    } */
    audioset.push(data);
    setAudioset([...audioset]);
    }

    let interval = setInterval(()=>{
      axios.get("http://13.200.37.225:7000/api/123").then(function(res){
      for(let e of res.data){
        if(!(id.includes(e.timestamp))){
          id.push(e.timestamp);
          if(e.username != props.profile.name){
            //audios.push({data:"http://13.200.37.225:7000/"+e.translated_audio[props.profile.data],name:e.username, timestamp:e.timestamp});
            updateAudio({data:"http://13.200.37.225:7000/"+e.translated_audio[props.profile.data],name:e.username, timestamp:e.timestamp});
        }else{
          //audios.push({data:"http://13.200.37.225:7000/"+e.original_audio, timestamp:e.original_audio.split('_')[0]});
          updateAudio({data:"http://13.200.37.225:7000/"+e.translated_audio[props.profile.data], timestamp:e.original_audio.split('_')[0]});
          }
        }
        
    }
      
    }).catch(function(error){
      console.log(error);
    })
    console.log(audioset);
     },5000);
     return () => {
      clearInterval(interval);
    };
   
    
  }, []);

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
function convertEpoch(value) {
  if (!value) {
    return ''
  }
  const time = new Date(Number(value)*1000);
  if (isNaN(time.valueOf())) {
    return '';
  }
  return time.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
}

  return (
    <>
    
      <h2>{props.profile.name}: {isConnected ?  <span>Connected</span> : <span>Disconnected</span>}</h2>
      <h5>Preferred Language: {lang[props.profile.data]}</h5>
      <div
        style={{
          height: '500px',
          overflowY: 'scroll',
          border: 'solid black 1px',
          padding: '10px',
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'column',
          width: '120vh',
          backgroundImage: 'linear-gradient(180deg, rgb(232, 239, 246), rgb(193, 223, 251))'
        }}
      >
        {messages.map((message, index) => (
          <Message message={message} key={index} name={props.profile.name}/>          
        ))}
        {audioset.map((res, index) => index !== -1 ?
                 res && (
                 res.name!=undefined?   <div
                        style={{
                            width: "100%",
                            height: 70,
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row"
                        }}><div>{res.name}:</div>
                        <div>
                            <div hidden>
                                <audio
                                    id={`audioId${index}`}
                                    onEnded={() => {
                                        if (document
                                            .getElementById(`playAudio${index}`)
                                            .classList.contains("fa-pause")) {
                                            document
                                                .getElementById(`playAudio${index}`)
                                                .classList.add("fa-play");
                                            document
                                                .getElementById(`playAudio${index}`)
                                                .classList.remove("fa-pause");
                                        }
                                        console.log(res.data);
                                    }}
                                    src={res.data}
                                    controls
                                    type="audio/mp3" />
                            </div>
                            <div>
                                <button className={"btn btn-primary"} style={{height:"2.5em", width:"2.5em", margin:"10px"}}>
                                    <i
                                        style={{ color: "white" }}
                                        id={`playAudio${index}`}
                                        onClick={(e) => stateaudio(e, index)}
                                        className={"fa fa-play"} />
                                </button><span style={{fontSize:"11px", fontWeight:"bolder",color:"grey"}}>{convertEpoch(res.timestamp)}</span>
                            </div>
                        </div>
                    </div>:
                    <div
                    style={{
                        width: "100%",
                        height: 70,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "end",
                        flexDirection: "row"
                    }}>
                    <div>
                        <div hidden>
                            <audio
                                id={`audioId${index}`}
                                onEnded={() => {
                                    if (document
                                        .getElementById(`playAudio${index}`)
                                        .classList.contains("fa-pause")) {
                                        document
                                            .getElementById(`playAudio${index}`)
                                            .classList.add("fa-play");
                                        document
                                            .getElementById(`playAudio${index}`)
                                            .classList.remove("fa-pause");
                                    }
                                }}
                                src={res.data}
                                controls
                                type="audio/mp3" />
                        </div>
                        <div>
                            <button className={"btn btn-warning" } style={{height:"2.5em", width:"2.5em", margin:"10px"}}>
                                <i
                                    style={{ color: "white" }}
                                    id={`playAudio${index}`}
                                    onClick={(e) => stateaudio(e, index)}
                                    className={"fa fa-play"} />
                            </button><span style={{fontSize:"11px", fontWeight:"bolder",color:"grey"}}>{convertEpoch(res.timestamp)}</span>
                        </div>
                    </div>
                </div>
                ): null)}
      </div>
<div style={{display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "end",
                        flexDirection: "row",
                        margin: 10}}>
<input
        type={'text'}
        id='message'
        style={{margin: 10, width:"100vh",  height:"2.5rem"}}
        onChange={(event) => {
          const value = event.target.value.trim();
          setMessage(value);
        }}
      ></input>
      
      
      <button
      className={"btn btn-success button"}
       style={{margin: 10, height:"2.5rem"}}
        onClick={() => {
          if (message && message.length) {
            socket.emit('chat', message);
          }
          
          var messageBox = document.getElementById('message');
          messageBox.value = '';
          setMessage('');
          
        }}
      >
        Send
      </button><Mic getAudio={getAudio}/>
</div>
      

    </>
  );
};
