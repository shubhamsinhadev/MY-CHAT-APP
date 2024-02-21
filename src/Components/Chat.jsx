import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Chat({ socket, username }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('')
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!username) {
            navigate('/')
        }
    }, [navigate, username])



    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue) {
            return;
        }

        socket.emit('chat message', {
            text: inputValue,
            id: socket.id,
            username: username
        });
        setInputValue('');
    };

    useEffect(() => {
        const handleIncomingMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };
        socket.on('chat message', (msg) => {
            setUserId(socket.id)
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message', handleIncomingMessage);
        };
    }, [socket]);
    return (
        <div className='h-[calc(100vh-50px)] bg-slate-300'>
            <div className=" mt-[50px] w-full flex justify-center ">
                <div className="w-[90%] mt-[80px] max-w-[600px] h-[calc(100vh-200px)] bg-white flex flex-col  items-center rounded-md justify-between shadow-md">
                    <ul className='w-[100%] flex flex-col p-2 gap-2'>
                        {messages.map((msg, index) => {
                            const { id, text, username } = msg;
                            if (id === userId) {
                                return (
                                    <li key={index} className=' w-[100%] text-white 
                                    flex flex-col items-end'>
                                        <div className='bg-violet-300 w-fit flex flex-col pl-1 pr-8 py-1 rounded-md'>
                                            <span className=' text-xs font-bold uppercase '>
                                                {username}
                                            </span>
                                            <span className=' text-lg mt-1'>
                                                {text}
                                            </span>
                                        </div>
                                    </li>
                                )
                            }
                            return (
                                <li key={index} className=' w-[100%] text-white 
                                flex flex-col'>
                                    <div className='bg-green-500 w-fit flex flex-col rounded-md
                                    pr-8 pl-1 py-1'>
                                        <span className='text-xs font-bold uppercase'>
                                            {username}
                                        </span>
                                        <span className=' text-lg  mt-1'>
                                            {text}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <form onSubmit={handleSubmit} className=" w-[90%] flex h-[40px] mb-2">
                        <input type="text" value={inputValue} className=' border-2 border-blue-400 flex-1 rounded-l-md pl-2' onChange={handleInputChange} />
                        <button type="submit" className=' bg-blue-400 px-4 text-white rounded-r-md hover:bg-blue-600 active:bg-blue-400  font-bold'>Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}