import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    courseData : []
}

export const getAllCourses = createAsyncThunk("/course/" , async()=>{
    try{
        const response = axiosInstance.get("/courses");
        toast.promise(response, {
            loading : "loading course data ...",
            success : "Courses loaded successfully",
            error : "Failed to get the courses",
        });

        return (await response).data.courses;
    } catch(error){
        toast.error(errror?.response?.data?.message);
    }
})

const courseSlice = createSlice({
    name : "courses",
    initialState,
    reducers : {},
    extraReducers : (builder) =>{

    }
});

export default courseSlice.reducer;