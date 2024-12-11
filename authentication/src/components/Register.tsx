"use client";

import { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import axios, { AxiosError } from "axios";
import NotificationResult from "../result/NotificationResult";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    axios
      .post("http://localhost:5000/register", formData)
      .then((response) => {
        setSuccess(response.data.message);
        setFormData({ email: "", username: "", password: "" }); 
      })
      .catch((err) => {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Registration failed";
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
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput
              id="username"
              type="text"
              placeholder="kennethgardiola"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="******"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Sign Up</Button>
          <div className="flex justify-center items-center gap-2">
            <p className="text-sm">
              Already have an account?{" "}
              <a href="/">
                <span className="font-bold italic hover:cursor-pointer">
                  Login
                </span>
              </a>
            </p>
          </div>
        </form>
      </Card>

      {success && (
        <NotificationResult
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

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

export default Register;
