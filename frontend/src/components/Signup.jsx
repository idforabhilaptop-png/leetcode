import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router"
import { useState } from "react";
import { Eye, EyeOff} from "lucide-react";


const signupSchema = z.object({
    firstName: z.string().min(3, "Minimum character should be 3"),
    emailId: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password is too weak"),
});

const Signup = () => {
     const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = (data) => {
        console.log(data);
        reset();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-md py-8 flex flex-col items-center gap-6">

                <img
                    className="w-40 h-auto"
                    src="./src/assets/leetcode2.png"
                    alt="leetcode"
                />

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col items-center gap-5"
                >
                    {/* Username */}
                    <div className="w-[80%]">
                        <label className="text-sm text-gray-600">
                            Username
                        </label>
                        <input
                            className="mt-1 w-full h-10 border border-gray-300 rounded-sm px-3 
                            focus:outline-none focus:border-gray-800 text-gray-600 hover:border-gray-700"
                            type="text"
                            placeholder="Enter username"
                            {...register("firstName")}
                        />
                        <p className="min-h-5 text-red-500 text-sm">
                            {errors.firstName?.message}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="w-[80%]">
                        <label className="text-sm text-gray-600">
                            Email address
                        </label>
                        <input
                            className="mt-1 w-full h-10 border border-gray-300 rounded-sm px-3 
                            focus:outline-none focus:border-gray-800 text-gray-600 hover:border-gray-700"
                            type="email"
                            placeholder="Enter email"
                            {...register("emailId")}
                        />
                        <p className="min-h-5 text-red-500 text-sm">
                            {errors.emailId?.message}
                        </p>
                    </div>

                    {/* Password */}
                    <div className="w-[80%] relative">
                        <label className="text-sm text-gray-600">
                            Password
                        </label>
                        <input
                            className="mt-1 w-full h-10 border border-gray-300 rounded-sm px-3 pr-12
                            focus:outline-none focus:border-gray-800 text-gray-600"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            {...register("password")}
                        />

                        {/* Show / Hide */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-800"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        
                        <p className="text-xs text-gray-400">
                            Minimum 8 characters
                        </p>
                        <p className="min-h-5 text-red-500 text-sm">
                            {errors.password?.message}
                        </p>
                    </div>

                    <button
                        className="mt-2 w-[80%] h-10 rounded-md bg-black text-white 
                        hover:bg-gray-800 active:scale-95 transition"
                        type="submit"
                    >
                        Sign up
                    </button>

                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}

                        <Link to="/login" className="text-black hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;



