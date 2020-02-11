// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { ipcRenderer } from "electron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faDownload } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../common/assets/logo.png";

import { openModal } from "../../../common/reducers/modals/actions";

export const Container = styled.div`
  width: 100vw;
  height: ${({ theme }) => theme.sizes.height.navbar}px;
  -webkit-user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
  }
`;

export const SettingsButton = styled.div`
  font-size: 22px;
  color: white;
  cursor: pointer;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing(3)}px;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: white;
    transition: all 0.2s ease-in-out;
  }
  path {
    cursor: pointer;
  }
  path:hover {
    color: white;
    transition: all 0.2s ease-in-out;
  }
`;

export const UpdateButton = styled.div`
  z-index: 10;
  cursor: pointer;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing(5)}px;
  font-size: 22px;
  color: ${props => props.theme.palette.colors.green};
  path {
    cursor: pointer;
  }
`;

const Navbar = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const location = useSelector(state => state.router.location.pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check every 10 minutes
    setInterval(() => {
      ipcRenderer.invoke("checkForUpdates");
      ipcRenderer.on("updateAvailable", () => {
        setUpdateAvailable(true);
      });
    }, 600000);
  }, []);

  const isLocation = loc => {
    if (loc === location) {
      return true;
    }
    return false;
  };

  if (isLocation("/")) return null;
  return (
    <Container>
      <img
        src={logo}
        height="36px"
        alt="logo"
        draggable="false"
        css={`
          z-index: 1;
        `}
      />
      <div>
        {updateAvailable && (
          <UpdateButton>
            <FontAwesomeIcon icon={faDownload} />
          </UpdateButton>
        )}
        <SettingsButton>
          <FontAwesomeIcon
            icon={faCog}
            onClick={() => dispatch(openModal("Settings"))}
          />
        </SettingsButton>
      </div>
    </Container>
  );
};

export default Navbar;