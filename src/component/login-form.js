"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdVisibilityOff } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { redirect } from "next/dist/server/api-utils";
import google from "../assets/google.png";
import apple from "../assets/apple.png";
import Image from "next/image";
import { db, auth,provider,fbProvider,githubProvider } from "../app/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";


import { useRouter } from 'next/navigation';
import { signInWithPopup } from "firebase/auth";
import { signInWithEmailAndPassword } from 'firebase/auth';




const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/[a-z]/, "Password must have at least one lowercase letter")
    .matches(/[0-9]/, "Password must have at least one number")
    .matches(/[@$!%*?&#]/, "Password must have at least one special character")
    .required("Password is required"),
});

const LoginForm = () => {
    const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  // const [
  //   signInWithEmailAndPassword,
  //   user,
  //   firebaseError
  // ] = useSignInWithEmailAndPassword(auth);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Login Successful!", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/chat-page");
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message || "Login Failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

   async function loginWithGoogle(){
    console.log("login with goole")
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Google SignIn Success:", user);
        toast.success("Logged in with Google!");
        router.push("/chat-page");
      } catch (error) {
        console.error("Google SignIn Error:", error.message);
        toast.error("Google login failed");
      }
  }
  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
  
      // Optional: save user to Firestore if needed
      console.log('GitHub User:', user.displayName, user.email);
  
      // Redirect or show success
    } catch (error) {
      console.error('GitHub Sign-in error:', error.message);
    }
  };

  return (
    <>
      <ToastContainer />

      <Box
        sx={{
          // minWidth: 300,
          // mx: "auto",
          // mt: 5,
          // p: 3,
          // boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Get Started Now
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
       

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? (
                      <MdVisibilityOff />
                    ) : (
                      <MdOutlineVisibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>

          <Box display={"flex"} marginTop={"12%"}>
            <Box width={"40%"} height={0} border={"1px solid black"}></Box>
            <Box width={"10%"}></Box>
            <Box width={"50%"} height={0} border={"1px solid black"}></Box>
          </Box>

          <Box
            width={"100%"}
            border={"1px solid black"}
            marginTop={"8%"}
            height={"35px"}
            display={"flex"}
          >
            <Box
              width={"50%"}
              height={"90%"}
              border={"1px solid black"}
              borderRadius={20}
              onClick={loginWithGoogle}
            >
              <Image
                src={google}
                height={20}
                width={20}
                alt="googleimg"
              ></Image>
              Login with google
            </Box>
            <Box
              width={"50%"}
              height={"90%"}
              border={"1px solid black"}
              borderRadius={20}
              marginLeft={"6%"}
              onClick={handleGitHubLogin}
            >
              <Image></Image>
              Login with apple
            </Box>
          </Box>

          <Box marginTop={5} paddingLeft={7}>
            <Typography>
              Haven't an account? <a href="/login">login</a>
            </Typography>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
