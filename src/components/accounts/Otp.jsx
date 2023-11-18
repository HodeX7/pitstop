import { useRef, useState } from "react";
import logo from "../../assets/OTPLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAPI } from "../../services/api.service";
import { Storage } from "@capacitor/storage";


const VerifyMobileOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid, contact_number } = location.state;

  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [inputIndex, setInputIndex] = useState(0);
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
    if (index === 4 && !otp.includes("")) {
      submitOTP();
    }
    
    setInputIndex(index);
  };

  const handleResendOTP = () => {
    // Logic to resend OTP
  };

  const handleAccessToken = async (token, uid) => {
    await Storage.set({
      key: 'access_token',
      value: token,
    });
    await Storage.set({
      key: 'uid',
      value: uid,
    });
    await Storage.set({
      key: 'isLoggedIN',
      value: 'yes',
    });
  }

  const submitOTP = () => {
    const enteredOTP = parseInt(otp.join(""))
    UserAPI.authenticateOTP(uid, enteredOTP)
      .then(res => {
        if (res) {
          handleAccessToken(res.data.accessToken, res.data.uid.toString());

          navigate('/', {replace: true});
        }
      })
      .catch(err => {
        console.error(err)
      })
  };

  const handleKeypadClick = (number) => {
    if (number === "Enter") {
      submitOTP();
    } else if (number === "<-") {
      if (inputIndex !== null) {
        setOtp([...otp.slice(0, inputIndex), "", ...otp.slice(inputIndex + 1)]);
        if (inputIndex > 0) inputRefs.current[inputIndex - 1].focus();
      }
    } else if (number != "<" && inputIndex !== null) {
      setOtp([
        ...otp.map((element, idx) => (idx === inputIndex ? number : element)),
      ]);
      if (inputIndex <= 3) inputRefs.current[inputIndex + 1].focus();
      if (inputIndex === 4 && !otp.includes("")) {
        submitOTP();
      }
    }
  };

  return (
    <div className="container mx-auto py-8 p-6">
      <div className="text-center">
        <img src={logo} alt="Logo" />
        <div>
          <h1 className="text-lg font-semibold mt-2">
            Verify your Mobile No. with OTP
          </h1>
          <h1 className="text-sm">
            OTP sent to <span className="font-semibold">{ contact_number }</span>
          </h1>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-8">
        <div className="flex gap-2">
          {otp.map((data, index) => {
            return (
              <input
                ref={(ref) => (inputRefs.current[index] = ref)}
                className="w-10 h-10 text-md border bg-slate-100 rounded-xl focus:outline-none focus:border-purple-400 text-center"
                type="text"
                placeholder="-"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={() => setInputIndex(index)}
              />
            );
          })}
        </div>
        <button
          className="ml-4 my-4 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded"
          onClick={handleResendOTP}
        >
          Resend OTP
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 ">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "<", 0, "Enter"].map((number, index) => (
          <button
            key={index}
            className="bg-gray-200 hover:bg-gray-300 text-black font-bold text-lg py-2 rounded"
            onClick={() => handleKeypadClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VerifyMobileOTP;
