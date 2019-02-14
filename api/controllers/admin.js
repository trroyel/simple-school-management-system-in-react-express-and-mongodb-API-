const fs = require('fs');
const _ = require('lodash');
const Fawn = require('fawn');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const model = require('../utility/modelUtil');
const role = require('../utility/userRoleUtil');
const { deleteFile } = require('../utility/fileUtility');
const { User } = require('../models/user');
const PDFDocument = require('pdfkit');
const path = require('path');
const { Admin, validate } = require('../models/admin');
const { AppSuccess, AppError } = require('../utility/responseUtil');


exports.getAdminById = async (req, res) => {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) throw new AppError('no admin is found!', 404);

    res.send(new AppSuccess(admin, 'admin retrive successfully!', 200));
};

exports.getAdmins = async (req, res) => {
    const admins = await Admin.find()
        .select('name fatherName qualification mobile image')
        .sort('_id');
    if (admins.length === 0)
        throw new AppError('no admin is found!', 404);

    res.send(new AppSuccess(admins, 'admins retrive successfully!'));
};


exports.createAdmin = async (req, res) => {
    const image = (req.file) ? req.file.path : '';
    const { error } = validate({ ...req.body, image });

    if (error) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError(error.details[0].message, 400)
    };

    const { name, address, designation, mobile, email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        deleteFile(image);
        throw new AppError('admin is already exists!', 409)
    };

    const salt = await bcrypt.genSalt(11);
    const _id = mongoose.Types.ObjectId();

    const newAdmin = new Admin({
        _id, name, address, designation, mobile, password, image
    });
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);

    const user = new User({
        email,
        model: model.Admin,
        role: role.ADMIN,
        detailsId: newAdmin._id
    });

    new Fawn.Task()
        .save('admins', newAdmin)
        .save('users', user)
        .run();

    res.send(new AppSuccess({
        admin: _.pick(newAdmin, ['name', 'address', 'designation', 'mobile']),
        user: _.pick(user, ['email', 'role'])
    }, 'user is saved', 200))
};

exports.updateAdminById = async (req, res) => {
    const image = (req.file) ? req.file.path : req.body.image;
    let newPassword = (req.body.password) ? req.body.password : null;

    const { error } = validate({
        ...req.body,
        email: 'demo@gmailcom',
        password: 'demopass',
        image: image
    });

    if (error) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError(error.details[0].message, 400)
    };

    const isAdminExist = await Admin.findById(req.params.id);
    if (!isAdminExist) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError('no admin is found!', 404)
    };

    const updatedData = _.pick(req.body,
        ['name', 'address', 'designation', 'mobile']);

    if (newPassword !== null) {
        let salt = await bcrypt.genSalt(11);
        newPassword = await bcrypt.hash(newPassword, salt);
        updatedData.password = newPassword;
    } else {
        updatedData.password = isAdminExist.password
    }
    updatedData.image = image;

    const updatedAdmin = await Admin.findByIdAndUpdate(
        req.params.id,
        { ...updatedData },
        { new: true }
    );

    if (!updatedAdmin) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError('admin is not updated!', 500);
    }

    if (isAdminExist.image !== image) deleteFile(isAdminExist.image);

    res.send(new AppSuccess(_.pick(updatedAdmin,
        ['name', 'address', 'designation', 'mobile']),
        'admin data is updated', 200));
};

exports.deleteAdminById = async (req, res) => {
    const { id } = req.params;
    const isAdminExist = await Admin.findById(id);

    if (!isAdminExist) throw new AppError('no admin is found to delete!', 404);
    if (isAdminExist.image) deleteFile(isAdminExist.image)

    let user = await User.findOne({ detailsId: id });
    user = await User.findByIdAndRemove(user._id);

    const admin = await Admin.findByIdAndRemove(id);

    res.send(new AppSuccess(_.pick(admin,
        ['name', 'address', 'designation', 'mobile']),
        'admin is deleted successfully!'));
};

exports.generatePdfByAdminId = async (req, res) => {
    const { id } = req.params;
    const admin = await Admin.findById(id).select('-password');
    if (!admin) throw new AppError('no admin is found!', 404);

    const documentName = `admin-${admin._id}.pdf`;
    const documentPath = path.join('data', 'pdfdoc', documentName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(documentPath));
    //pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('admin Details');
    pdfDoc.fontSize(18).text('---------------------------------------------------------');
    pdfDoc.fontSize(18).text(`Name:  ${admin.name}`);
    pdfDoc.fontSize(18).text(`Address:  ${admin.address}`);
    pdfDoc.fontSize(18).text(`Designation:  ${admin.designation}`);
    pdfDoc.fontSize(18).text(`Mobile:  ${admin.mobile}`);
    pdfDoc.fontSize(18).text(`Image:  ${admin.image}`);

    pdfDoc.end();

    res.status(201).send({ url: `/invoice/${documentName}`, message: 'pdf file is generated!' });

};