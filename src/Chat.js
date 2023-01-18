import logo from './logo.svg';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import './App.css';

function Chat() {
  const socket = io('http://localhost:5000',{  
    cors: {
    origin: "http://localhost:5000",
    credentials: true
  },transports : ['websocket'] });
  const [text, setText] = useState('');
  const [sts, setSts] = useState(false);
  const [nama, setNama] = useState('');
  const [room, setRoom] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('get data', (data) => { 
      console.log("loop");
      setRoom(data);
    });
    socket.emit('get data')

    socket.on('new data', (data) => { 
      console.log(data);
      setRoom(past => [...past, data]);
    });

    return () => {
      socket.off('connect');
      socket.off('get data');
      socket.off('new data');
    };
  }, []);

  const sendMessage = async(message, nama) => {
    setSts(true)
    await socket.emit('new data', {message, nama});
    setText('')
    setSts(false)
 
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1><img className='App-logo' src={logo} width={'80px'} alt="logo" />Web Chat App</h1>
        <form onSubmit={(e) => (e.preventDefault(),sendMessage(text,nama))}>
          <input style={{width:"100px", marginRight:"10px"}} value={nama} onInput={(e) => setNama(e.target.value)} placeholder='Nama....' type="text" required/>
          <input value={text} onInput={(e) => setText(e.target.value)} placeholder='pesan....' type="text" required/>
          <button disabled={sts}>Kirim</button>
        </form>
        <br /><br />
        <table cellSpacing={0} cellPadding={20}>
          <tbody>
            {room.map((data, i) => 
            <tr key={i}>
              <td>{data.nama}</td>
              <td>:</td>
              <td>{data.message}</td>
              <td style={{fontSize:'11px', textAlign:'right'}}>{data.createdAt}</td>
            </tr>
            )}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default Chat;
