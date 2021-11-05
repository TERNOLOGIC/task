import TextField, { TextFieldProps } from "@material-ui/core/TextField";

export type SigningFormErrorsInterface = {
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
  confirmEmail?: string | null,
  password?: string | null,
  confirmPassword?: string | null,
  agreeTermAndCond?: boolean | string | null,
}


const TextFieldFormControl = (props: TextFieldProps & { formErrors?: SigningFormErrorsInterface }) => {
  const { formErrors, ...otherFieldProps } = props;
  const name = props.name as keyof SigningFormErrorsInterface;

  return <TextField
    variant="outlined"
    size="small"
    id={name}
    label={props.label}
    error={Boolean(formErrors && formErrors[name])}
    helperText={formErrors && formErrors[name]}
    fullWidth
    autoComplete="off"
    inputProps={{
      autoComplete: 'off'
   }}
    {...otherFieldProps}
  />
}

export default TextFieldFormControl;
