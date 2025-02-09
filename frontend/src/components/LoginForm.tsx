"use client"

import styled from 'styled-components';

interface Props {
  signinIn?: any;
}

export const Container = styled.div`
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  width: 678px;
  max-width: 100%;
  min-height: 320px;

  @media (max-width: 768px) {
    min-height: 650px;
  }
`;

export const SignUpContainer = styled.div<Props>`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  ` : null}

  @media (max-width: 768px) {
    width: 100%;
    height: 50%;
    ${props => props.signinIn !== true ? `
      transform: translateY(100%);
    ` : null}
  }
`;

export const SignInContainer = styled.div<Props>`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}

  @media (max-width: 768px) {
    width: 100%;
    height: 50%;
    ${props => (props.signinIn !== true ? `transform: translateY(100%);` : null)}
  }
`;

export const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 35px;
  height: 100%;
  text-align: center;
`;

export const Title = styled.h1`
  font-weight: 600;
  margin: 0;
  color: #0355bb;
  font-size: 22px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 5px 0;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #027cc4;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 12px 8px 38px;
  width: 100%;
  transition: all 0.3s ease;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #027cc4;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(2, 124, 196, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Button = styled.button`
  border-radius: 12px;
  border: 1px solid #027cc4;
  background-color: #027cc4;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 35px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #0355bb;
    border-color: #0355bb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(2, 124, 196, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
  padding: 8px 30px;
  
  &:hover {
    background-color: #ffffff;
    color: #027cc4;
    box-shadow: none;
  }
`;

export const Anchor = styled.a`
  color: #0355bb;
  font-size: 13px;
  text-decoration: none;
  margin: 10px 0;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #027cc4;
  }
`;

export const OverlayContainer = styled.div<Props>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props => props.signinIn !== true ? `transform: translateX(-100%);` : null}

  @media (max-width: 768px) {
    left: 0;
    top: 50%;
    width: 100%;
    height: 50%;
    ${props => props.signinIn !== true ? `transform: translateY(-100%);` : null}
  }
`;

export const Overlay = styled.div<Props>`
  background: linear-gradient(135deg, #027cc4 0%, #0355bb 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => (props.signinIn !== true ? `transform: translateX(50%);` : null)}

  @media (max-width: 768px) {
    left: 0;
    top: -100%;
    height: 200%;
    width: 100%;
    transform: translateY(0);
    ${props => (props.signinIn !== true ? `transform: translateY(50%);` : null)}
  }
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 25px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  @media (max-width: 768px) {
    height: 50%;
    width: 100%;
    transform: translateY(0);
    padding: 0 16px;
  }
`;

export const LeftOverlayPanel = styled(OverlayPanel)<Props>`
  transform: translateX(-20%);
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}

  @media (max-width: 768px) {
    transform: translateY(-20%);
    ${props => props.signinIn !== true ? `transform: translateY(0);` : null}
  }
`;

export const RightOverlayPanel = styled(OverlayPanel)<Props>`
  right: 0;
  transform: translateX(0);
  ${props => props.signinIn !== true ? `transform: translateX(20%);` : null}

  @media (max-width: 768px) {
    bottom: 0;
    top: auto;
    transform: translateY(0);
    ${props => props.signinIn !== true ? `transform: translateY(20%);` : null}
  }
`;

export const Paragraph = styled.p`
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.3px;
  margin: 12px 0 20px;
  opacity: 0.9;

  @media (max-width: 768px) {
    margin: 8px 0 16px;
    font-size: 12px;
  }
`;