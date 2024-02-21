import { useNavigate } from "react-router-dom";

export default function Home({ setUsername, username }) {
    const navigate = useNavigate();

    const usernameFn = () => {
        if (username) {
            navigate('/chat')

        } else {
            alert('Please enter a username to continue');
            return
        }
    }

    const usernameIn = (e) => {
        setUsername(e.target.value)
    }

    return (
        <div className=" w-full mt-[50px] h-[calc(100vh-50px)] flex justify-center bg-slate-300">
            <div className="w-[90%] mt-8 h-[200px] max-w-[600px] bg-white flex flex-col  items-center rounded-md  shadow-md justify-around">
                <span className=" font-bold">
                    ENTER YOUR USERNAME
                </span>
                <input
                    type="text"
                    className="w-[50%] border p-2 rounded-md bg-slate-100 "
                    onChange={usernameIn}
                />
                <button
                    className=" w-[50%] bg-red-500 text-white py-2 font-bold rounded-md"
                    onClick={usernameFn}>
                    SUBMIT
                </button>

            </div>
        </div>
    )
}