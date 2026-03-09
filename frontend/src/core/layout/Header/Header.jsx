import { Menu, X } from "lucide-react";
import { Button, Dialog } from "../../ui";

import MobileDrawer from './MobileDrawer';
import UserAvatar from './UserAvatar';
import SearchBar from './SearchBar';
import ThemeToggle from "../../ui/ThemeToggle";
import ProjectPicker from '../../../features/project/components/ProjectPicker';
import UpdatesDropdown from '../../../features/update/components/UpdatesDropdown';

import { useHeader } from '../../hooks/useHeader';

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
        isWorkspaceView
    } = useHeader({ setIsSignup });

    const match = location.pathname.match(/^\/project\/(\d+)/);
    const urlProjectId = match ? match[1] : null;
    const isHamburgerValid = !isWorkspaceView || (isWorkspaceView && String(activeProject?.id) === String(urlProjectId));

    return (
        <>
            <header className="sticky top-0 z-30 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#404040] px-4 py-3 md:px-8 h-[70px]">
                <nav className="flex items-center h-full gap-4 justify-between">

                    <div className="flex items-center">
                        {isWorkspaceView ? (
                            <ProjectPicker />
                        ) : (
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
                        )}
                    </div>

                    {isWorkspaceView && isTaskListPage && (
                        <div className="hidden md:flex flex-1 justify-center px-4 max-w-xl">
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
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3">
                            {isLoggedIn && isWorkspaceView && <UpdatesDropdown />}
                            <ThemeToggle />
                            {!isLoggedIn ? (
                                <>
                                    <Button variant="outlined" onClick={handleLoginClick}>Login</Button>
                                    <Button variant="primary" onClick={handleSignupClick}>Signup</Button>
                                </>
                            ) : (
                                !isWorkspaceView && (
                                    <Button variant="danger" onClick={handleLogoutClick} size="md">Logout</Button>
                                )
                            )}
                        </div>

                        <div className="flex md:hidden items-center gap-3">
                            {isLoggedIn && isWorkspaceView && <UpdatesDropdown />}
                            <ThemeToggle />
                            {isHamburgerValid && (
                                <button onClick={handleDrawerToggle} className="p-0.5 text-gray-600 dark:text-[#bfbfbf] hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer">
                                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>

                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <MobileDrawer
                open={mobileMenuOpen && !isWorkspaceView}
                isLoggedIn={isLoggedIn}
                onClose={handleCloseMobileMenu}
                onLogin={handleLoginClick}
                onSignup={handleSignupClick}
                onLogout={handleLogoutClick}
            />

            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                title="Logout?"
                size="sm"
            >
                <p className="text-gray-600 dark:text-[#bfbfbf] mb-6">Are you sure you want to logout?</p>
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
