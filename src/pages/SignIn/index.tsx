import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  Avatar,
  Button,
  CssBaseline,
  InputAdornment,
  IconButton,
  Link,
  Grid,
  Typography,
  Container,
  TextFieldProps,
} from "@material-ui/core";

import { useStyles } from "./styles";
import { SCREEN_KEY } from "../../constants";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  useCallback,
  useState,
  useMemo,
  ChangeEvent,
  SyntheticEvent
} from "react";
import useNavigationContext from "../../hooks/navigationContext";
import {
  TextFieldFormControl,
} from "../../components";
import { getLocalStorageItem, setLocalStorageItem } from "../../utils";
import { UserInterface } from '../../constants/interfaces';

export default function SignIn() {
  const classes = useStyles();
  const {navigateToScreen} = useNavigationContext();
  const navToSignUp = useCallback(() => { navigateToScreen(SCREEN_KEY.SIGN_UP) }, []);
  const navToHome = useCallback(() => { navigateToScreen(SCREEN_KEY.HOME) }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClickShowPassword = () => setShowPassword(pre => !pre);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }
  const formFields: TextFieldProps[] = useMemo(
    () => [
      {
        required: true,
        label: "Email Address",
        name: "email",
        type: "text",
      },
      {
        required: true,
        label: "Password",
        name: "password",
        type: showPassword ? "text" : "password",
        InputProps: {
          // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }
      }
  ], [showPassword]);

  const handleSignIn = (event: SyntheticEvent) => {
    event?.preventDefault();
    const errorMessage = "Incorrect username or password";
    setLoading(true)
    setError("")
    setTimeout(() => {
      const registeredUsers = getLocalStorageItem("users") as UserInterface[];
      const user = registeredUsers && registeredUsers.find((user) => user?.email === inputs.email);
      if (user) {
        if(user.password === inputs.password) {
          setLocalStorageItem('token', user);
          navToHome()
        }
      } else { 
        setError(errorMessage)
      }
      setLoading(false)
    }, 2000);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            {formFields.map((fieldProp) => (
              <Grid item xs={12} sm={12}>
                <TextFieldFormControl
                  onChange={handleChange}
                  {...fieldProp}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignIn}
          >
              {loading ? "Loading ..." : "Sign In" }
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={navToSignUp}>
                You do not have an account? Sign up
              </Link>
            </Grid>
          </Grid>
          <Grid container justify="center">
            {error && <Typography style={{marginTop: '1em'}} component="h5" color="error">
              {error}
            </Typography>}
          </Grid>
        </form>
      </div>
    </Container>
  );
}
