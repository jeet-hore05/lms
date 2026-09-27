import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

import { createNewCourse } from "../../Redux/Slices/CourseSlice.js";
import HomeLayout from "../../Layouts/HomeLayout.jsx";

function CreateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: "",
        category: "",
        price: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: ""
    });

    // Handle thumbnail upload
    function handleImageUpload(e) {
        e.preventDefault();

        const uploadedImage = e.target.files[0];

        if (uploadedImage) {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(uploadedImage);

            fileReader.addEventListener("load", function () {
                setUserInput((prevState) => ({
                    ...prevState,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                }));
            });
        }
    }

    // Handle input fields
    function handleUserInput(e) {
        const { name, value } = e.target;

        setUserInput((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    // Submit course
    async function onFormSubmit(e) {
        e.preventDefault();

        if (
            !userInput.title ||
            !userInput.description ||
            !userInput.category ||
            !userInput.price ||
            !userInput.createdBy ||
            !userInput.thumbnail
        ) {
            toast.error("All fields are mandatory");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));

        if (response?.payload?.success) {
            setUserInput({
                title: "",
                category: "",
                price: "",
                createdBy: "",
                description: "",
                thumbnail: null,
                previewImage: ""
            });

            navigate("/courses");
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center min-h-screen px-4 py-10">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-full max-w-[700px] shadow-[0_0_10px_black] relative"
                >
                    {/* Back button */}
                    <Link
                        to="/courses"
                        className="absolute top-8 left-4 text-2xl link text-accent cursor-pointer"
                    >
                        <AiOutlineArrowLeft />
                    </Link>

                    <h1 className="text-center text-2xl font-bold">
                        Create New Course
                    </h1>

                    <main className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-10">

                        {/* LEFT SIDE */}
                        <div className="flex flex-col gap-5">

                            {/* Thumbnail */}
                            <div>
                                <label
                                    htmlFor="image_uploads"
                                    className="cursor-pointer"
                                >
                                    {userInput.previewImage ? (
                                        <img
                                            className="w-full h-44 object-cover m-auto border"
                                            src={userInput.previewImage}
                                            alt="Course thumbnail preview"
                                        />
                                    ) : (
                                        <div className="w-full h-44 m-auto flex items-center justify-center border">
                                            <h1 className="font-bold text-lg text-center">
                                                Upload your course thumbnail
                                            </h1>
                                        </div>
                                    )}
                                </label>

                                <input
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png, .webp"
                                    name="image_uploads"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {/* Course Title */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg font-semibold"
                                    htmlFor="title"
                                >
                                    Course Title
                                </label>

                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-transparent px-2 py-1 border rounded"
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>

                            {/* Course Price */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg font-semibold"
                                    htmlFor="price"
                                >
                                    Course Price
                                </label>

                                <input
                                    required
                                    type="number"
                                    name="price"
                                    id="price"
                                    min="0"
                                    placeholder="Enter course price"
                                    className="bg-transparent px-2 py-1 border rounded"
                                    value={userInput.price}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-col gap-5">

                            {/* Instructor */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg font-semibold"
                                    htmlFor="createdBy"
                                >
                                    Course Instructor
                                </label>

                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-2 py-1 border rounded"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg font-semibold"
                                    htmlFor="category"
                                >
                                    Course Category
                                </label>

                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-2 py-1 border rounded"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg font-semibold"
                                    htmlFor="description"
                                >
                                    Course Description
                                </label>

                                <textarea
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-2 py-1 h-24 overflow-y-auto resize-none border rounded"
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>
                    </main>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2 rounded-sm font-semibold text-lg cursor-pointer bg-yellow-600 hover:bg-yellow-500 transition-all duration-300"
                    >
                        Create Course
                    </button>
                </form>
            </div>
        </HomeLayout>
    );
}

export default CreateCourse;

