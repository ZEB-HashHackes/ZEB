import express from "express";
import Art from "../models/art.model.js";
import {Types} from "mongoose";
import multer from "multer";
import { ArtService } from "../services/art.service.js";

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "File is required"
      });
    }

    const {
      title,
      description,
      creatorBy,
      ownedBy,
      category,
      minPrice
    } = req.body;

    if (!title || !creatorBy || !ownedBy) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields"
      });
    }

    const {
      contentHash,
      similarityHash,
      similarityMethod,
      fileType,
      mimeType
    } = await ArtService.storeFile(req.file);

    const art = await Art.create({
      title,
      description,
      filePath: `uploads/${contentHash}`,
      fileType,
      mimeType,
      contentHash,
      similarityHash,
      similarityMethod,
      creatorBy,
      ownedBy,
      category,
      minPrice
    } as any);

    res.status(201).json({
      status: "ok",
      message: "Art created successfully",
      data: {
        artId: (art as any)._id,
        hash: contentHash
      }
    });

  } catch (err: any) {
    console.error("Create art error:", err);
    
    if (err.message.includes("Duplicate") || err.message.includes("Similar")) {
      return res.status(409).json({
        status: "error",
        message: err.message
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});


router.post("/register", async (req, res) => {
  try{
    const { title, description,
            filePath, contentHash,
            creatorBy, ownedBy,
            category, minPrice } = req.body;

    const art = new Art({ title, description,
            filePath, contentHash,
            creatorBy, ownedBy,
            category, minPrice });

    await art.save();
    res.status(201).json({status: "ok", message: "Art created.", data: art._id});

  } catch(err){
    console.error("Error creating art", err);
    res.status(500).json({status:"error", message: "Error creating art"});
  }
});



router.get("/:id", async (req, res) => {
     if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "error", message: "Invalid ID" });
    }
    const art = await Art.findById(req.params.id);
    if (!art) res.status(404).json({status:"error", message:"Art not found."});
    res.status(200).json({status:"ok", data: art});
});

// GET all artworks (Marketplace)
router.get("/", async (req, res) => {
  try {
    const arts = await Art.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "ok", data: arts });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error fetching artworks" });
  }
});

// GET artworks by creator
router.get("/creator/:address", async (req, res) => {
  try {
    const arts = await Art.find({ creatorBy: req.params.address }).sort({ createdAt: -1 });
    res.status(200).json({ status: "ok", data: arts });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error fetching creator's artworks" });
  }
});

// GET artworks by owner
router.get("/owner/:address", async (req, res) => {
  try {
    const arts = await Art.find({ ownedBy: req.params.address }).sort({ createdAt: -1 });
    res.status(200).json({ status: "ok", data: arts });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error fetching owned artworks" });
  }
});


router.put("/price/:id", async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "error", message: "Invalid ID" });
    }
    const {minPrice} = req.body;
    const updated = await Art.findByIdAndUpdate(req.params.id, 
                                                {minPrice: minPrice},
                                                {returnDocument: 'after', runValidators: true});

    if (!updated) return res.status(404).json({status:"error", message:"art not found"});
    res.status(200).json({status:"ok", message:"minprice upadated", data: updated.minPrice});

  }catch (err){
    console.log("Error upadating minprice", err);
    res.status(500).json({status: "error", message:"Error upadating minprice", data : err});
  }
});

router.put("/owner/:id", async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "error", message: "Invalid ID" });
    }
    const {ownedBy} = req.body;
    const updated = await Art.findByIdAndUpdate(req.params.id, 
                                                {ownedBy: ownedBy},
                                                {returnDocument: 'after', runValidators: true});

    if (!updated) return res.status(404).json({status:"error", message:"art not found"});
    res.status(200).json({status:"ok", message:"owner upadated", data: updated.ownedBy});
  }catch (err){
    console.log("Error upadating owner", err);
    res.status(500).json({status: "error", message:"Error upadating owner", data : err});
  }
});



export default router;

