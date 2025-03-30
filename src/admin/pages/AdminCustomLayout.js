import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { AdminContext } from "../pages/context/admin.context";

const { Header, Sider, Content } = Layout;

const AdminCustomLayout = () => {
  const { admin, _setAdmin } = useContext(AdminContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const themeColors = {
    sidebarBg: "#0056b3",         
    sidebarText: "#ffffff",       
    sidebarHover: "#003d82",      
    headerBg: "#0069d9",         
    contentBg: "#fafbfd",        
    logoutColor: "#EE4B2B",      
  };

  useEffect(() => {
    const isAdminLogin = localStorage.getItem("is_admin_login");
    if (isAdminLogin !== "1" || !admin) {
      navigate("/admin/login");
    }
  }, [navigate, admin]);

  const handleLogoutClick = () => {
    _setAdmin(null);
    localStorage.setItem("is_admin_login", "0");
    navigate("/admin/login");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: themeColors.sidebarBg,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            padding: "16px",
            color: themeColors.sidebarText,
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: `1px solid ${themeColors.sidebarHover}`,
          }}
        >
          {admin?.username}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{
            background: themeColors.sidebarBg,
            color: themeColors.sidebarText,
            height: "calc(100% - 50px)", // Adjust for username section height
          }}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: (
                <NavLink
                  to="/admin/dashboard"
                  style={{ color: themeColors.sidebarText, textDecoration: "none" }}
                >
                  Dashboard
                </NavLink>
              ),
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: (
                <NavLink
                  to="/admin/manage-users"
                  style={{ color: themeColors.sidebarText, textDecoration: "none" }}
                >
                  Manage Users
                </NavLink>
              ),
            },
            {
              key: "3",
              icon: <FileTextOutlined />,
              label: (
                <NavLink
                  to="/admin/manage-posts"
                  style={{ color: themeColors.sidebarText, textDecoration: "none" }}
                >
                  Manage Posts
                </NavLink>
              ),
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: handleLogoutClick,
              style: { color: themeColors.logoutColor },
            },
          ]}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: collapsed ? 80 : 200,
            right: 0,
            zIndex: 1000,
            height: "64px",
            background: themeColors.headerBg,
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            transition: "left 0.2s",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: themeColors.sidebarText,
            }}
          />
        </Header>

        <Content
          style={{
            marginTop: "64px",
            padding: "24px",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            background: themeColors.contentBg,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminCustomLayout;