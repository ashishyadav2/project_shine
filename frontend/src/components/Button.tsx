interface ButtonProps {
  buttonText: string;
  //   buttonColor: string;
  buttonColor?: "primary" | "danger" | "secondary";
  buttonFunction?: () => void;
}
const Button = ({
  buttonText,
  buttonColor = "primary",
  buttonFunction,
}: ButtonProps) => {
  return (
    <button type="button" className={`rounded-lg`} onClick={buttonFunction}>
      {buttonText}
    </button>
  );
};

export default Button;
