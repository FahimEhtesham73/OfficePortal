import React from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import {useDispatch,useSelector} from 'react-redux'
import { addUser } from '../store/slices/UserSlice';


const theme = createTheme();

const Signin = () => {
    const dispatch = useDispatch()
    const data = useSelector((state)=>{
        return state.users //Here users is userSlice which we defined as users in store  //Here state represents the whole state of the project which is store 
    })
    // console.log("User Data",data);
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        const userData = new FormData(event.currentTarget);
        // console.log(userData);
        const res = await fetch(`${process.env.REACT_APP_URL}/users/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userData.get('email'), password: userData.get('password')
            }),
            credentials: 'include',
            withCredentials:true
        })
        const data = await res.json()
        // console.log(data);
        
        if (res.status === 400) {
            toast.success(data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            // toast(data.message, {
            //     position: "top-center",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            // });
        }
        else {
            localStorage.setItem("userData", JSON.stringify(data))
            dispatch(addUser(data))
            toast.success('Log in successfully', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
            navigate('/')
        }
    };
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ marginTop: "150px" }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Signin



