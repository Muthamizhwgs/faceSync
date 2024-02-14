const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const AdminService = require('../services/admin.service')
const { generateAuthTokens } = require('../services/token.service');
const { TempImg } = require('../models/admin');
const faceApi = require('face-api.js');
const fs = require('fs');
const path = require('path');
const { Canvas, Image, ImageData, loadImage } = require('canvas');

const createFaceSyncUsers = catchAsync(async (req, res) => {
    const data = await AdminService.createFaceSyncUsers(req);
    res.send(data)
})

const Login = catchAsync(async (req, res) => {
    const data = await AdminService.Login(req);
    const token = await (generateAuthTokens(data))
    res.send({ data, token })
})

const createEvents = catchAsync(async (req, res) => {
    const data = await AdminService.createEvents(req);
    res.send(data)
})

const getEvents = catchAsync(async (req, res) => {
    const data = await AdminService.getEvents(req);
    res.send(data)
})

const createPhotoGrapher = catchAsync(async (req, res) => {
    const data = await AdminService.createPhotoGrapher(req);
    res.send(data)
})
const getPhotographers = catchAsync(async (req, res) => {
    const data = await AdminService.getPhotographers(req);
    res.send(data)
})

const uploadGroupImages = catchAsync(async (req, res) => {
    if (req.files.length > 0) {
        let paths = [];
        let picimages = []
        let path = '';
        req.files.forEach(function (files, index, arr) {
            path = 'groups/' + files.filename;
            paths.push(path);
            picimages.push(files.filename);
        });
        let creations = await TempImg.create({ imagesNmas: picimages, images: paths })
        detectFace(req, res)
        res.send(creations)
    }
})

faceApi.env.monkeyPatch({ Canvas, Image, ImageData });

const imagePhotographerFolder = path.join(__dirname, '../../public/groups');
const imageUserFolder = path.join(__dirname, '../../public/images');

const detectFace = async (req, res) => {
    try {
        // Load models
        await faceApi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, '../../public/ssd_mobilenetv1'));
        await faceApi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, '../../public/face_landmark_68'));
        await faceApi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, '../../public/face_recognition'));

        // Load reference images (marriage folder) and extract face descriptors
        const referenceDescriptors = await Promise.all(fs.readdirSync(imagePhotographerFolder).map(async photographerImage => {
            const photographerImagePath = path.join(imagePhotographerFolder, photographerImage);
            const photographerImg = await loadImage(photographerImagePath);
            const detections = await faceApi.detectAllFaces(photographerImg).withFaceLandmarks().withFaceDescriptors();
            if (!detections.length) {
                console.log(`No face detected in reference image: ${photographerImage}`);
                return null; // Skip images with no face detected
            }
            const descriptors = detections.map(detection => detection.descriptor);
            return new faceApi.LabeledFaceDescriptors(photographerImage, descriptors);
        }));

        // Load user images and extract face descriptors
        const userDescriptors = await Promise.all(fs.readdirSync(imageUserFolder).map(async userImage => {
            const userImagePath = path.join(imageUserFolder, userImage);
            const userImg = await loadImage(userImagePath);
            const detections = await faceApi.detectAllFaces(userImg).withFaceLandmarks().withFaceDescriptors();
            if (!detections.length) {
                console.log(`No face detected in user image: ${userImage}`);
                return null; // Skip images with no face detected
            }
            const descriptors = detections.map(detection => detection.descriptor);
            return new faceApi.LabeledFaceDescriptors(userImage, descriptors);
        }));

        // Filter out null descriptors from both reference and user images
        const filteredReferenceDescriptors = referenceDescriptors.filter(descriptor => descriptor !== null);
        const filteredUserDescriptors = userDescriptors.filter(descriptor => descriptor !== null);

        // Iterate through each user descriptor and compare with all reference descriptors
        const result = [];
        for (const userDescriptor of filteredUserDescriptors) {
            const userImage = userDescriptor.label;
            const matches = [];
            for (const referenceDescriptor of filteredReferenceDescriptors) {
                if (userDescriptor.descriptors.length !== referenceDescriptor.descriptors.length) {
                    console.log(`Descriptor lengths do not match for ${userImage} and ${referenceDescriptor.label}`);
                }
                console.log(referenceDescriptor.descriptors[0], "ajsdghsajdgh")
                const faceMatcher = new faceApi.FaceMatcher(referenceDescriptor.descriptors[0], 0.5);
                console.log(userDescriptor.descriptors);
                const bestMatch = faceMatcher.findBestMatch(userDescriptor.descriptors[0]);
                console.log(bestMatch, "dist")
                console.log(bestMatch);
                matches.push({ referenceImage: referenceDescriptor.label, bestMatch });
            }
            result.push({ userImage, matches });
        }
        // Send the result as JSON
        return ({ result });
    } catch (error) {
        console.error("Error detecting faces:", error);
    }
};


const createAdminBySuperAdmin = catchAsync(async(req,res)=>{
    const data = await AdminService.createAdminBySuperAdmin(req);
    res.send(data)
}) 

const updateEventsById = catchAsync(async(req,res)=>{
    const data = await AdminService.updateEventsById(req);
    res.send(data)
})

const updatePhotographer = catchAsync(async(req,res)=>{
    const data = await AdminService.updatePhotographer(req);
    res.send(data)
})

const EventAssign_to_PhotoGrapher = catchAsync(async(req,res)=>{
    const data = await AdminService.EventAssign_to_PhotoGrapher(req);
    res.send(data)
})

const getEventsByPhotoGrapher = catchAsync(async(req,res)=>{
    const data = await AdminService.getEventsByPhotoGrapher(req);
    res.send(data)
})

const getAdmins = catchAsync(async(req,res)=>{
    const data = await AdminService.getAdmins(req);
    res.send(data)
})

module.exports = {
    createFaceSyncUsers,
    Login,
    createEvents,
    getEvents,
    createPhotoGrapher,
    getPhotographers,
    createAdminBySuperAdmin,
    updateEventsById,
    updatePhotographer,
    EventAssign_to_PhotoGrapher,
    getEventsByPhotoGrapher,
    getAdmins,
}