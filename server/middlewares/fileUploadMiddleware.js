import fileUpload from 'express-fileupload';


function fileUploadMiddleware (req,res,next) {
    if (req.files) {
        fileUpload({
            limits: {fileSize: 10 * 1024 * 1024}
        })(req,res,next)
    } else {
        next()
    }
}

export default fileUploadMiddleware