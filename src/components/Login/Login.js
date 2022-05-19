import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if(action.type === 'USER_INPUT'){
    return{ value: action.val, isValid: action.val.includes('@')}
  }
  if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.includes('@')}
  }
  return {value:'', isValid: false};
};

const passwordReducer = (state, action) => {
  if(action.type === 'USER_INPUT'){
    return{ value: action.val, isValid: action.val.trim().length > 6}
  }
  if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.trim().length > 6}
  }
  return {value:'', isValid: false};
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {value:'', isValid: null});
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: null});

  const authCtx = useContext(AuthContext);
  // useEffect(() => {
  //   console.log('EFFECT RUNNING');

  //   return () => {
  //     console.log('EFFECT CLEANUP');
  //   };
  // }, [enteredPassword]) 
  // 의존성이 없을때는 모든 컴포넌트 렌더링 주 후 실행
  // 의존성을 빈배열로만 주면, 컴포넌트가 처음으로 마운트되고 렌더링 될때만 실행
  // 의존성에 [enteredPassword] 넣으면, 이 state가 변경 될때만 실행
  // return은  useEffect 전에 실행되고, 컴포넌트가 제거되면 실행

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsVailid } = passwordState;
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking from validity!');
      setFormIsValid(
        emailIsValid && passwordIsVailid
      );
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    }
    
  }, [emailIsValid, passwordIsVailid])

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});
    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.value.trim().length > 6);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT', val: event.target.value});
    // setFormIsValid(
    //   emailState.value.includes('@') && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};


export default Login;