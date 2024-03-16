import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Chat({ socket, username }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('')
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [output, setOutput] = useState('');
    const ref = useRef(null)

    useEffect(() => {
        if (!username) {
            navigate('/')
        }
    }, [navigate, username])

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (event) => {
            const image = new Image();
            image.src = event.target.result;

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 1280; // Set maximum width
                const maxHeight = 720; // Set maximum height
                let width = image.width;
                let height = image.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    setOutput(blob);
                }, 'image/jpeg', 0.6); // Set desired quality (0 to 1)
            };
        };
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue && !output) {
            return;
        }

        let base64 = '';

        if (output) {
            const reader = new FileReader();
            reader.onload = () => {
                base64 = reader.result;
                socket.emit('chat message', {
                    text: null,
                    id: socket.id,
                    username: username,
                    image: base64
                });
            };
            reader.readAsDataURL(output); // Start reading the data of the selected image file
        } else {
            socket.emit('chat message', {
                text: inputValue,
                id: socket.id,
                username: username,
                image: null
            });
        }

        setInputValue('');
        setOutput('');
    };


    useEffect(() => {
        const k = ref.current
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    k.scrollTop = k.scrollHeight - k.clientHeight
                }
            }
        });

        observer.observe(k, { attributes: true, childList: true, subtree: true });
        return () => {
            observer.disconnect();
        };
    }, []);



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
        <div
            className='h-[calc(100vh-50px)] bg-slate-300'>
            <div
                className=" mt-[50px] w-full flex justify-center ">
                <div
                    className="w-[90%] mt-[80px] max-w-[600px] h-[calc(100vh-200px)] bg-white flex flex-col 
                 items-center rounded-md justify-between shadow-md">
                    <ul
                        ref={ref}
                        className='w-[100%] flex-1 flex flex-col p-2 gap-2 overflow-scroll overflow-x-hidden'>
                        {messages.map((msg, index) => {
                            const { id, text, username, image } = msg;
                            if (id === userId) {
                                return (
                                    <li key={index} className=' w-[100%] text-white 
                                    flex flex-col items-end'>
                                        {text &&
                                            <div className='bg-violet-300 w-fit flex flex-col pl-1 pr-8 py-1 rounded-md'>
                                                <span className=' text-xs font-bold uppercase '>
                                                    {username}
                                                </span>
                                                <span className=' text-lg mt-1'>
                                                    {text}
                                                </span>
                                            </div>
                                        }
                                        {image && <img src={image} className='w-[50%] max-w-[80%] object-contain' />}
                                    </li>
                                )
                            }
                            return (
                                <li key={index} className=' w-[100%] text-white 
                                flex flex-col'>
                                    {text &&
                                        <div className='bg-green-500 w-fit flex flex-col rounded-md
                                         pr-8 pl-1 py-1'>
                                            <span className='text-xs font-bold uppercase'>
                                                {username}
                                            </span>
                                            <span className=' text-lg  mt-1'>
                                                {text}
                                            </span>
                                        </div>
                                    }
                                    {image && <img src={image} className=' w-[50%] max-w-[80%] object-contain' />}
                                </li>
                            )
                        })}
                    </ul>
                    <form onSubmit={handleSubmit} className=" w-[90%] grid grid-cols-2 h-[100px] mb-2">
                        <input
                            type="text"
                            value={inputValue}
                            className=' border-2 col-span-2  border-blue-400 flex-1 rounded-l-md pl-2'
                            onChange={handleInputChange} />
                        <input
                            type='file'
                            className=' col-span-2 border flex items-center justify-center'
                            onChange={handleImageChange} />
                        <button
                            type="submit"
                            className=' col-span-2  bg-blue-400 px-4 text-white rounded-r-md hover:bg-blue-600 active:bg-blue-400  
                            font-bold'
                        >Send</button>

                    </form>
                </div>
            </div>
        </div>
    )
}
