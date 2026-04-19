import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new AppError("Unauthenticated, please login again.",401));
    }

    const userDetails =await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

const authorizedRoles = (...roles) => async(req,res,next)=>{
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next(new AppError("You don't have permission to access this route",403));
    }

    next();
}

const isEnrolled = () => async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const { id: courseId } = req.params;

    // Admin can access everything
    if (role === "ADMIN") {
      return next();
    }

    const user = await User.findById(userId).select("purchasedCourses");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if course is purchased
    const hasPurchased = user.purchasedCourses.some(
      (c) => c.toString() === courseId
    );

    if (!hasPurchased) {
      return next(
        new AppError("Access denied. Please purchase this course.", 403)
      );
    }

    next();
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export{
    isLoggedIn, authorizedRoles, isEnrolled
}