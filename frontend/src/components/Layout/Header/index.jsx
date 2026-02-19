import { Menu } from "lucide-react";
import { Button, Dialog } from "../../ui";

import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";
import ProjectPicker from "../../Project/ProjectPicker";

import { useHeader } from "../../../hooks/layout/useHeader";

const Header = ({ setIsSignup }) => {
    const {
        location,
        navigate,
        isLoggedIn,
        isVerified,
        hasProjects,
        userName,
        searchTerm,
        activeProject,
        mobileMenuOpen,
        isAdmin,
        logoutDialogOpen,
        handleDrawerToggle,
        handleLoginClick,
        handleSignupClick,
        handleLogoutClick,
        handleLogoutConfirm,
        handleLogoutCancel,
        handleSearchChange,
        handleClearSearch,
        handleEditProfileClick,
        handleCloseMobileMenu,
        isTaskListPage,
        shouldShowMobileMenu
    } = useHeader({ setIsSignup });

    return (
        <>
            <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-5 py-3 sm:px-8 h-full max-h-[70px]">
                <nav className="flex items-center h-full">
                    <div className="w-full justify-center items-center hidden md:flex gap-4 h-full">
                        {!isVerified || !hasProjects ? (
                            <div>
                                <h1
                                    className="text-2xl text-primary font-semibold cursor-pointer"
                                    onClick={() =>
                                        activeProject
                                            ? navigate(`/project/${activeProject.id}`)
                                            : navigate("/")
                                    }
                                >
                                    Rhine
                                </h1>
                            </div>
                        ) : (
                            <ProjectPicker />
                        )}

                        {!isLoggedIn ? (
                            <div className="w-full flex justify-end gap-3">
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        navigate("/");
                                        setIsSignup(false);
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        navigate("/");
                                        setIsSignup(true);
                                    }}
                                >
                                    Signup
                                </Button>
                            </div>
                        ) : (
                            <div className="flex w-full justify-between items-center gap-4">

                                <div className="w-full flex justify-center items-center">
                                    {isTaskListPage && (
                                        <SearchBar
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onClear={handleClearSearch}
                                            placeholder={
                                                location.pathname.includes("/team")
                                                    ? "Search team members by name or email..."
                                                    : "Search tasks..."
                                            }
                                        />
                                    )}
                                </div>

                            </div>
                        )}
                        {!shouldShowMobileMenu(location.pathname) && isLoggedIn && (
                            <Button variant="danger" onClick={handleLogoutClick} size='md'>
                                Logout
                            </Button>
                        )}
                    </div>

                    <div className="md:hidden w-full justify-between items-center flex gap-4">
                        {isLoggedIn && isVerified ? <ProjectPicker /> : (
                            <div>
                                <h1
                                    className="text-2xl text-primary font-semibold cursor-pointer"
                                    onClick={() =>
                                        activeProject
                                            ? navigate(`/project/${activeProject.id}`)
                                            : navigate("/")
                                    }
                                >
                                    Rhine
                                </h1>
                            </div>
                        )}
                        {!shouldShowMobileMenu(location.pathname) && isLoggedIn && (
                            <Button variant="danger" onClick={handleLogoutClick}>
                                Logout
                            </Button>
                        )}
                        {shouldShowMobileMenu(location.pathname) && (
                            <button onClick={handleDrawerToggle} className="p-2 text-gray-600 hover:text-gray-800 cursor-pointer">
                                <Menu size={24} />
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            <MobileDrawer
                open={mobileMenuOpen && !isLoggedIn}
                isLoggedIn={isLoggedIn}
                userName={userName}
                isAdmin={isAdmin}
                onClose={handleCloseMobileMenu}
                onLogin={handleLoginClick}
                onSignup={handleSignupClick}
                onEditProfile={handleEditProfileClick}
                onLogout={handleLogoutClick}
                isVerified={isVerified}
            />

            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                title="Logout?"
                size="sm"
            >
                <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={handleLogoutCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogoutConfirm}>
                        Logout
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default Header;
