const path = require('path');
const multer = require('multer');
const createHttpError = require('http-errors');



const Uploader = function (sub_folder, file_type, max_file_size, err_msg) {

    const U_FOLDER = path.join(__dirname, '/../../public') + `/uploads/${sub_folder}/`;
    //Store data to the location
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, U_FOLDER);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + uniqueSuffix;

            cb(null, fileName + fileExt);
        }
    });
    //check file type validation
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: max_file_size,
        },
        fileFilter: (req, file, cb) => {

            if (file_type.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createHttpError(err_msg));
            }
        }
    });

    return upload;

}

function avatarUpload(req, res, next) {
    const upload_avatar = Uploader("avatars", ["image/jpeg", "image/jpg", "image/png"], 1000000, "Only .jpg, jpeg or .png format allowed!");
    upload_avatar.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                errors: {
                    avatar: { msg: err.message },
                }
            })
        } else {
            next();
        }
    });

}


module.exports = avatarUpload;