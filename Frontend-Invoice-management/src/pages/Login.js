import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../store/slice/AuthSlice";
import { addUserDetails } from "../store/slice/userSlice";
import api from "../services/api";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (form.name === "" || form.password === "") {
      alert("Please enter both name and password to login.");
      return;
    }

    dispatch(loginStart());

    try {
      const data = await api.loginWorker(form);
      if (data) {
        dispatch(loginSuccess(data));
        dispatch(addUserDetails(data))
        navigate("/");
      } else {
        dispatch(loginFailure("Invalid credentials"));
        alert("Login failed! Invalid credentials.");
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
      dispatch(loginFailure("An error occurred during login"));
      alert("Login failed! " + error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      <div className="flex justify-center">
        <img src={require("../assets/signup.jpg")} alt="" />
      </div>
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src={require("../assets/logo.png")}
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              start your 14-day free trial
            </span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={loginUser}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                User Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                onChange={handleInputChange}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="User Name"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={handleInputChange}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <p className="text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Register now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
