"use client";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import NotificationResult from "../result/NotificationResult";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    axios
      .post("http://localhost:5000/login", formData)
      .then((result) => {
        // console.log(result)
        if(result.data.message === "Success") {
          const token = result.data.token;

          localStorage.setItem('token', token);

          navigate('/Home');
        }
      })
      .catch((err) => {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Login failed";
        setError(errorMessage);
      });
  };
  return (
    <div className="h-screen flex items-center justify-center">
        <Card className="w-96">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="email@gmail.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                placeholder="******"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit">Login</Button>
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm">
                Don't have an account yet?{" "}
                <a href="/Register">
                  <span className="font-bold italic hover:cursor-pointer">
                    Register
                  </span>
                </a>
              </p>
            </div>
          </form>
        </Card>

        {error && (
          <NotificationResult
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
    </div>
  );
};

export default Login;
