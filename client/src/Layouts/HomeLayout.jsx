import { FiMenu } from 'react-icons/fi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../Components/footer';
import { logout } from '../Redux/Slices/AuthSlice.js';

function HomeLayout({ children }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // for checking if user is logged in
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    // for displaying the options acc to the role
    const role = useSelector((state) => state?.auth?.role);

    function changeWidth() {
        const drawerSide = document.getElementsByClassName("drawer-side");
        drawerSide[0].style.width = "auto";
    }

    function hideDrawer() {
        const element = document.getElementsByClassName("drawer-toggle");
        element[0].checked = false;

        changeWidth();

    }

    async function handleLogout(e) {
        e.preventDefault();

        const res = await dispatch(logout());
        if (res?.payload?.success)
            navigate("/");
    }

    return (
        <div className="min-h-[90vh]">
            <div className="drawer absolute left-0 z-50 w-fit">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="cursor-pointer relative">
                        <FiMenu
                            onClick={changeWidth}
                            size={"32px"}
                            className='font-bold text-white m-4'
                        />
                    </label>
                </div>
                <div className="drawer-side w-0">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className="menu w-48 p-4 h-[100%] sm:w-80 bg-base-200 text-base-content relative">
                        <li className='w-fit absolte right-2 z-50'>
                            <button onClick={hideDrawer}>
                                <AiFillCloseCircle size={24} />
                            </button>
                        </li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        {isLoggedIn && role === 'ADMIN' && (
                            <li>
                                <Link to="/admin/dashboard"></Link>
                            </li>
                        )}

                        <li>
                            <Link to="/courses">All Courses</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact Us</Link>
                        </li>
                        <li>
                            <Link to="/about">About Us</Link>
                        </li>

                        {!isLoggedIn && (
                            <div className='absolute w-full left-0 flex items-center justify-center px-2 gap-2 bottom-4'>
                                <button className='btn btn-primary flex-1 px-4 py-1 font-semibold rounded-md'>
                                    <Link to="/login">Login</Link>
                                </button>

                                <button className='btn btn-secondary flex-1 px-4 py-1 font-semibold rounded-md'>
                                    <Link to="/signup">Sign up</Link>
                                </button>
                            </div>
                        )}

                        {isLoggedIn && (
                            <div className='absolute w-full left-0 flex items-center justify-center px-2 gap-2 bottom-4'>
                                <button className='btn btn-primary flex-1 px-4 py-1 font-semibold rounded-md'>
                                    <Link to="/user/profile">Profile</Link>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className='btn btn-secondary flex-1 px-4 py-1 font-semibold rounded-md'
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </ul>
                </div>
            </div>

            {children}

            <Footer />

        </div>
    )
}

export default HomeLayout;