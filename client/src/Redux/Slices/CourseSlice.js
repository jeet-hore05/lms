import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance.js";

const initialState = {
    courseData : []
}

export const getAllCourses = createAsyncThunk("/courses", async () => {
    try {
        const response = await axiosInstance.get("/courses");

        toast.success("Courses loaded successfully");

        return response.data.courses;

    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const createNewCourse = createAsyncThunk(
    "/courses/create",
    async (data) => {
        try {
            let formData = new FormData();

            formData.append("title", data?.title);
            formData.append("description", data?.description);
            formData.append("price", data?.price);
            formData.append("category", data?.category);
            formData.append("createdBy", data?.createdBy);
            formData.append("thumbnail", data?.thumbnail);

            const response = await axiosInstance.post(
                "/courses",
                formData
            );

            toast.success("Course created successfully");

            return response.data;

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to create course"
            );

            throw error;
        }
    }
);


const courseSlice = createSlice({
    name : "courses",
    initialState,
    reducers : {},
    extraReducers : (builder) =>{
        builder
        .addCase(getAllCourses.fulfilled, (state, action)=>{
            if(action.payload) {
                console.log(action.payload);
                state.courseData = [ ...action.payload];
            }
        })
    }
});

export default courseSlice.reducer;