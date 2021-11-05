import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  Avatar,
  Button,
  CssBaseline,
  InputAdornment,
  IconButton,
  Link,
  FormControlLabel,
  Checkbox,
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
  MouseEvent
} from "react";
import useNavigationContext from "../../hooks/navigationContext";
import {
  TextFieldFormControl,
  SigningFormErrorsInterface,
} from "../../components";
import { validateEmail, isEmptyString, validatePassword, ValidationPasswordInterface, setLocalStorageItem, getLocalStorageItem } from "../../utils";
const REQUIRED_MESSAGE = "Required";
const INVALID_EMAIL_ADDRESS_MESSAGE = "Invalid email address";

export default function SignUp() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false)
  const { navigateToScreen } = useNavigationContext();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    agreeTermAndCond: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<ValidationPasswordInterface | null>(null);
  const handleClickShowPassword = () => setShowPassword(pre => !pre);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(pre => !pre);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "agreeTermAndCond" && event.target.checked)
      setInputs((values) => ({ ...values, [name]: "true" }));
    else setInputs((values) => ({ ...values, [name]: value }));
  };

  const [formErrors, setFormErrors] = useState<SigningFormErrorsInterface>({
    firstName: null,
    lastName: null,
    email: null,
    confirmEmail: null,
    password: null,
    confirmPassword: null,
    agreeTermAndCond: false,
  });

  const navToSignIn = useCallback(() => {
    navigateToScreen(SCREEN_KEY.SIGN_IN);
  }, []);
  const navToHome = useCallback(() => {
    navigateToScreen(SCREEN_KEY.HOME);
  }, []);
  const formFields: TextFieldProps[] = useMemo(
    () => [
      {
        name: "firstName",
        required: true,
        label: "First Name",
        type: "text",
        autoFocus: true,
      },
      {
        required: true,
        name: "lastName",
        label: "Last Name",
        type: "text",
      },
      {
        required: true,
        label: "Email Address",
        name: "email",
        type: "text",
      },
      {
        required: true,
        label: "Confirm Email Address",
        name: "confirmEmail",
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
        },
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: showConfirmPassword ? "text" : "password",
        required: true,
        InputProps: {
          // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        },
      },
    ],
    [showPassword, showConfirmPassword]
  );
  const validateFormFields = (event: ChangeEvent<HTMLFormElement>) => {
    let cloneErrorState = Object.assign({}, formErrors);
    const name = event.target.name;
    const value = event.target.value;
    switch (name) {
      case "firstName":
        if (isEmptyString(value)) cloneErrorState.firstName = REQUIRED_MESSAGE;
        else cloneErrorState.firstName = null;
        break;
      case "lastName":
        if (isEmptyString(value)) cloneErrorState.lastName = REQUIRED_MESSAGE;
        else cloneErrorState.lastName = null;
        break;
      case "email":
        if (!validateEmail(value))
          cloneErrorState.email = INVALID_EMAIL_ADDRESS_MESSAGE;
        else if (
          !isEmptyString(inputs.confirmEmail) &&
          inputs.confirmEmail !== value
        )
          cloneErrorState.confirmEmail = "Emails does not match!";
        else if (
          !isEmptyString(inputs.confirmEmail) &&
          inputs.confirmEmail === value
        ) {
          cloneErrorState.email = null;
          cloneErrorState.confirmEmail = null;
        } else cloneErrorState.email = null;
        break;
      case "confirmEmail":
        if (!validateEmail(value))
          cloneErrorState.confirmEmail = INVALID_EMAIL_ADDRESS_MESSAGE;
        else if (inputs.email !== value)
          cloneErrorState.confirmEmail = "Email does not match!";
        else cloneErrorState.confirmEmail = null;
        break;
      case "password":
        const validations = validatePassword(value);
        setPasswordValidation(validations);
        if (isEmptyString(value)) cloneErrorState.password = REQUIRED_MESSAGE;
        else if (
          !isEmptyString(inputs.confirmPassword) &&
          inputs.confirmPassword !== value
        )
          cloneErrorState.confirmPassword = "Password does not match!";
        else if (!validations.all)
          cloneErrorState.password = "Password must contain at least 8 characters in lower and uppercase and at least one special character"
        else cloneErrorState.password = null;
        break;
      case "confirmPassword":
        if (isEmptyString(value))
          cloneErrorState.confirmPassword = REQUIRED_MESSAGE;
        else if (inputs.password !== value)
          cloneErrorState.confirmPassword = "Password does not match!";
        else cloneErrorState.confirmPassword = null;
        break;
      case "agreeTermAndCond":
        if (!event.target.checked) cloneErrorState.agreeTermAndCond = true;
        else cloneErrorState.agreeTermAndCond = null;
        break;
      default:
        break;
    }
    setFormErrors(cloneErrorState);
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    let users = getLocalStorageItem("users") || [];
    users.push(inputs);
    // set user data in local storage.
    setLoading(true)
    setTimeout(() => {
      setLocalStorageItem('token', inputs);
      setLocalStorageItem('users', users);
      setLoading(false);
      navToHome()
    }, 3000);
  };

  const isNoErrorExited = useMemo(
    () => Object.values(formErrors).every((error) => !Boolean(error)),
    [formErrors]
  );
  const isAllFieldsHaveValue = useMemo(
    () => Object.values(inputs).every((input) => Boolean(input)),
    [inputs]
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          onChange={validateFormFields}
          onBlur={validateFormFields}
          noValidate
        >
          <Grid container spacing={2}>
            {formFields.map((fieldProp) => (
              <Grid item xs={12} sm={12}>
                <TextFieldFormControl
                  onChange={handleChange}
                  formErrors={formErrors}
                  {...fieldProp}
                />
                {fieldProp.name === "password" && !isEmptyString(inputs.password) && !passwordValidation?.all && (
                  <div className={classes.passwordValidation}>
                    <Grid container justify="space-between">
                      <span className={passwordValidation?.lowercaseStatus ? classes.spanSuccess : classes.spanDanger}>One lowercase character</span>
                      <span className={passwordValidation?.specailStatus ? classes.spanSuccess : classes.spanDanger}>One special character</span>
                    </Grid>
                    <Grid container justify="space-between">
                      <span className={passwordValidation?.uppercaseStatus ? classes.spanSuccess : classes.spanDanger}>One uppercase character</span>
                      <span className={passwordValidation?.lengthStatus ? classes.spanSuccess : classes.spanDanger}>8 characters minimum</span>
                    </Grid>
                    <Grid container justify="space-between">
                      <span className={passwordValidation?.numbersStatus ? classes.spanSuccess : classes.spanDanger}>one number</span>
                    </Grid>
                  </div>
                )}
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeTermAndCond"
                    defaultChecked={Boolean(inputs.agreeTermAndCond)}
                    color="primary"
                    onChange={handleChange}
                  />
                }
                label="I agree to the terms and conditions."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={!isNoErrorExited || !isAllFieldsHaveValue || loading}
          >
            {loading ? "Loading ..." : "Sign Up" }
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={navToSignIn}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
