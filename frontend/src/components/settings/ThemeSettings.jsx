import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slide,
} from "@mui/material";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FiArrowLeft} from "react-icons/fi";
import {
  closeDrawer,
  openDrawerLeft,
} from "../../redux/slices/chat/leftDrawer.slice";

const ThemeSettings = ({containerRef}) => {
  const dispatch = useDispatch();

  const [themeValue, setThemeValue] = useState("light");

  const {isOpen} = useSelector((state) => state.leftDrawer);
  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("settings"));
  };
  const handleThemeValue = (event) => {
    setThemeValue(event.target.value);
  };

  return (
    <Slide
      in={isOpen}
      direction="left"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div>
        <div className="flex m-2 mb-5  ">
          <button onClick={handleBack} className=" cursor-pointer mr-4 ">
            <FiArrowLeft />
          </button>
          <p className="text-xl">Theme </p>
        </div>

        <div className="p-4 mb-4 border   bg-white">
          <FormControl component="fieldset">
            <RadioGroup
              value={themeValue}
              onChange={handleThemeValue}
              className="space-y-2">
              <FormControlLabel
                value="dark"
                control={<Radio />}
                label="Dark"
                className="text-gray-700"
              />

              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
                className="text-gray-700"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </Slide>
  );
};

export default ThemeSettings;
