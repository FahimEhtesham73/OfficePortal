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
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const theme = createTheme();

const Signin = () => {
    const dispatch = useDispatch()
    const data = useSelector((state)=>{
        return state.users 
        //Here users is userSlice which we defined as users in store  
        //Here state represents the whole state of the project which is store 
    })
    // console.log("User Data",data);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
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
            withCredentials: true
        })
        const data = await res.json()
        // console.log(data);
        
        if (res.status !== 200) {
            toast.success('Invalid credentials', { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }
        else {
            // localStorage.setItem("userData", JSON.stringify(data))
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
                        {/* <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                           
                            
                        /> */}


<FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            name="password"
          />
        </FormControl>
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



