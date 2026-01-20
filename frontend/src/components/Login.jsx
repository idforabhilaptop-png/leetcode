
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff} from "lucide-react";
import { Link } from "react-router"



// Zod schema for login
const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log(data); // { emailId, password }
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
          {/* Email */}
          <div className="w-[80%]">
            <label className="text-sm text-gray-600">
              Email address
            </label>
            <input
              className="mt-1 w-full h-10 border border-gray-300 rounded-sm px-3
                            focus:outline-none focus:border-gray-800 text-gray-600"
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


            <p className="min-h-5 text-red-500 text-sm">
              {errors.password?.message}
            </p>
          </div>

          <button
            className="mt-2 w-[80%] h-10 rounded-md bg-black text-white
                        hover:bg-gray-800 active:scale-95 transition"
            type="submit"
          >
            Log in
          </button>

          {/* Extra UX */}
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}

            <Link to="/signup" className="text-black hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
