import React, {  useState } from 'react';
import { Chat } from './Chat';
import app_logo from './assets/app_logo.png';

function App() {
  const [data, setData] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [valid, isValid] = useState(false);
  const [profile, setProfile] = useState({name:"", data:""});
    const options = [{label:"English", value:"en"},
    {label:"Hindi", value:"hi"},
    {label:"Bengali", value:"bn"},
    {label:"French", value:"fr"}];
    const onOptionChangeHandler = (event) => {
      for (let opt of options){
        if(opt.label===event.target.value){
          setData(opt.value);
          break;
        }
      }
      
      console.log(
          "User Selected Value - ",
          data, event.target.value
      );
  };
  const login = ()=>{
    if(data!=undefined && name!=undefined && data.length > 0 && name.length>0){
      isValid(true);
      setProfile({name,data});
    }
  };

  const signOut = () => {
    setData("");
    setName("");
    isValid(false);
  }
  return (
    <>
    <div style={{ display:"flex",flexDirection:"column",  justifyContent:"space-between", alignItems:"center", height:"100vh"}}>
    <div style={{justifyContent:"space-between", alignContent:"center", textAlign:"center",
  height:"70px", width: "98%", backgroundColor:"#D4AFF9", margin:"15px", display:"flex",flexDirection:"row",
  justifyContent:"space-between", borderRadius:"15px", boxShadow:"5px 3px 5px #9E9E9E"}}>
    <h4 style={{alignItems:"flex-start", paddingLeft:"1em", paddingTop:"3px", fontFamily:"cursive"}}><img src={app_logo} style={{height:"3em", width:"3em"}} /> Multi-Linguistic Voice App</h4>
    {valid?<button className='btn-btn-secondary' style={{fontWeight:"bolder", margin:"15px", borderRadius:"10px", borderWidth:"4px",
    borderBlockColor:"red", color:"red"}} onClick={signOut} >Sign Out</button>:null}
    </div>
      
      {!valid? 
       <div className="loginForm" 
       style={{justifyContent:"space-between", 
       alignContent:"center", 
       textAlign:"center",
       borderBlockColor: "black",
       borderWidth: "3px",
       height: "85em",
       width: "85em",
       margin: "5em"
       }}>
          <label style={{margin:"1em"}}>Name: </label><input
            type={'text'}
            id='name'
            onChange={(event) => {
              const value = event.target.value.trim();
              setName(value);
            }} ></input> <br/>
          <select className="lang" onChange={onOptionChangeHandler}
          style={{margin: "1em",
                  width: "17em"}}>
                    <option>Please choose preferred Language</option>
                    {options.map((option, i) => {
                        return (
                            <option key={i}>
                                {option.label}
                            </option>
                        );
                    })}
                </select>
          <br/>
          <button style={{
             background:"white",
             height: "3rem",
             width: "6rem",
             borderBlockColor: "green",
             borderRadius: "15px",
             borderWidth: "4px",
             margin: "1em",
          }} type="submit" onClick={login}>Let's Go</button>
      </div> :
      <Chat profile={profile}/> }
    </div>
    </>
  );
}

export default App;
