import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import InputAdornment from '@mui/material/InputAdornment'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockIcon from '@mui/icons-material/Lock'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useState } from 'react'
import { useForm,SubmitHandler  } from 'react-hook-form'
import IconButton from '@mui/material/IconButton';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdVisibilityOff } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { redirect } from 'next/dist/server/api-utils'
import google from '../assets/google.png'
import apple from '../assets/apple.png'
import Image from 'next/image'
import {db,auth} from '../app/firebaseConfig'
import{collection,addDoc} from 'firebase/firestore'
import{useCreateUserWithEmailAndPassword}from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation';

// async function addDataToFireStore(data){
//   try{
//     const docRef = await addDoc(collection(db, "users"), {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//     });
//     console.log("Document written with ID:", docRef.id);
//     return true;
//   } catch(error){
//     console.log("Error is:", error);
//     return false;
//   }
// }

const addDataToFireStore = async (data, uid) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: data.name,
      email: data.email,
      uid: uid,
    });

    console.log("Document written with ID: ", docRef.id);
    return docRef; // <- return the docRef for two-way response
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

  



const schema = yup.object().shape({
  // role: yup.string().required("Role is required"),
  name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/[a-z]/, "Password must have at least one lowercase letter")
    .matches(/[0-9]/, "Password must have at least one number")
    .matches(/[@$!%*?&#]/, "Password must have at least one special character")
    .required("Password is required"),

});


const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

 
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
 

  // const onSubmit = async (data) => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(data.email, data.password);
  
  //     if (userCredential) {
  //       await addDataToFireStore(data);
  //       toast.success("Signup Successful!", {
  //         position: "top-right",
  //         autoClose: 3000,
  //       });
        
  //       console.log("navigate to login");
  //       setTimeout(() => {
  //       router.push('/login')// using window.location because `redirect()` is a Next.js server function
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.error("Signup error:", error.message);
  //     toast.error(error.message || "Signup Failed");
  //   }
  // };


  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        data.email,
        data.password
      );
  
      if (userCredential?.user?.uid) {
        const uid = userCredential.user.uid;
  
        const docRef = await addDataToFireStore(data, uid); // two-way here
        toast.success("Signup Successful!", {
          position: "top-right",
          autoClose: 3000,
        });
  
        console.log("Firestore doc ID:", docRef.id);
        router.push("/login");
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      toast.error(error.message || "Signup Failed");
    }
  };
  

  function googleSignup(){
    console.log("google button is clicked")
  }


  function appleSignup(){
    console.log("apple button is clicked")
  }

 
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
          label="Name"
          fullWidth
          margin="normal"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

     
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
                  {showPassword ? <MdVisibilityOff /> : <MdOutlineVisibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

   
  


        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Signup
        </Button>

        <Box display={'flex'} marginTop={'12%'}>
          <Box width={'40%'} height={0}border={'1px solid black'}></Box>
          <Box width={'10%'}></Box>
          <Box width={'50%'} height={0}border={'1px solid black'}></Box>
        </Box>

        <Box width={'100%'} border={'1px solid black'} marginTop={'8%'} height={'35px'} display={'flex'}>
          <Box width={'50%'} height={'90%'} border={'1px solid black'} borderRadius={20} onClick={googleSignup}>
              <Image src={google} height={15}width={15} alt='googleimg'  ></Image>
             <Typography>sign in with google</Typography>
          </Box>
          <Box width={'50%'} height={'90%'} border={'1px solid black'} borderRadius={20} marginLeft={'6%'} onClick={appleSignup}>
            <Image src={apple}  height={15}width={15} alt='appleimg' ></Image>
            <Typography>sign in with apple</Typography>
          </Box>
        </Box>

        <Box marginTop={5} paddingLeft={7} >
          <Typography >Have an account? <a href='/login' >login</a></Typography>
         
        </Box>





       
      </form>
    </Box>
  </>
  )
}

export default SignupForm
