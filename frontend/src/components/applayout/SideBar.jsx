import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import SpaceDashboardTwoToneIcon from '@mui/icons-material/SpaceDashboardTwoTone';
import requestApi from "../utils/axios";
import { decryptData } from "../utils/encrypt";
import "./styles.css";

function getIconComponent(iconPath) {
  switch (iconPath) {
    case 'BorderColorTwoToneIcon':
      return <BorderColorTwoToneIcon style={{ color: '#f57d93', fontSize: '30px' }} className="custom-sidebar-icon" />;
    case 'SpaceDashboardTwoToneIcon':
      return <SpaceDashboardTwoToneIcon style={{ color: '#05ce78', fontSize: '30px' }} className="custom-sidebar-icon" />;
    default:
      return null;
  }
}

function SideBar({ open, resource, onSidebarItemSelect, handleSideBar }) {
  const [activeItem, setActiveItem] = useState("");
  const [sidebarItems, setSidebarItems] = useState([]);
  const location = useLocation();
  // const navigate = useNavigate();
  const basePath = import.meta.env.VITE_BASE_PATH;

  useEffect(() => {
    const fetchSidebarItems = async () => {
      try {
        const encryptedData = localStorage.getItem('D!');
        const decryptedData = decryptData(encryptedData);
        const { role: roleid } = decryptedData; 
        // console.log("Decrypted Role ID:", roleid);

        const response = await requestApi("POST", `/resource`, { role: roleid });
        // console.log(response)
        if (response.success) {
          setSidebarItems(response.data); 
        } else {
          console.error("Error fetching sidebar items:", response.error);
        }
      } catch (error) {
        console.error("Error fetching sidebar items:", error);
      }
    };

    fetchSidebarItems(); 
  }, [resource]);

  useEffect(() => {
    const pathname = location.pathname;
    const activeItem = sidebarItems.find((item) => `${basePath}` + item.path === pathname);
    if (activeItem) {
      setActiveItem(activeItem.name);
      if (onSidebarItemSelect) {
        onSidebarItemSelect(activeItem.name);  
      }
    }
  }, [location, sidebarItems, onSidebarItemSelect]);

  return (
    <div
      className={open ? "app-sidebar sidebar-open" : "app-sidebar"}
      style={{
        backgroundColor: "#2a3645",
      }}
    >
      <p style={{ color: 'white' }} className="a-name">Skill Survey</p>
      <ul className="list-div">
        {sidebarItems.map((item) => (
          <li
            key={item.path}
            className={`list-items ${activeItem === item.name ? "active" : ""}`}
            onClick={() => {
              setActiveItem(item.name);
              onSidebarItemSelect(item.name);
              handleSideBar();
            }}
          >
            <Link className="link" to={`${basePath}` + item.path}>
              {getIconComponent(item.icon)}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
