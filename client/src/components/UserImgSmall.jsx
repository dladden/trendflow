import React from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa6';

const UserImgSmall = ({ user_img, githubUrl }) => {
  const handleClick = (e) => {
    if (githubUrl) {
      e.stopPropagation(); // Prevent the card click event from being triggered
    }
  };
  return (
    <>
      {githubUrl ? (
        <LinkContainer
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          {user_img ? (
            <img src={user_img} alt="user image" className="img" />
          ) : (
            <FaUser size={16} className="icon" />
          )}
        </LinkContainer>
      ) : (
        <ImageContainer>
          {user_img ? (
            <img src={user_img} alt="user image" className="img" />
          ) : (
            <FaUser size={16} className="icon" />
          )}
        </ImageContainer>
      )}
    </>
  );
};
const ImageContainer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.children.type === 'img' ? 'transparent' : 'var(--grey-50)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;  // This will clip any content that exceeds the container boundaries


  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover; // Ensures the image covers the area without distorting aspect ratio
  }

  svg {
    color: white; // Optional: change the color of the FaUser icon if needed
  }
  .icon {
    transform: translateY(2px); // Adjust this value to move the icon down
    color: var(--grey-70);
  }
`;
const LinkContainer = styled.a`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.children.type === 'img' ? 'transparent' : 'var(--grey-50)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  svg {
    color: white;
  }

  .icon {
    transform: translateY(2px);
    color: var(--grey-70);
  }

  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    cursor: pointer;
  }
`;
export default UserImgSmall;
