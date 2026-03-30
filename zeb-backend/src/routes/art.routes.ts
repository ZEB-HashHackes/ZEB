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
      category = "image",
      minPrice = "0"
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
      mimeType,
      filePath: serviceFilePath
    } = await ArtService.storeFile(req.file);

    // 1. Check for Exact Duplicates (Content Hash)
    const exactExisting = await Art.findOne({ contentHash });
    if (exactExisting) {
      if (exactExisting.creatorBy === creatorBy) {
        // Same creator: Allow resumption
        return res.status(200).json({
          status: "ok",
          message: "Artwork already exists for you. Resuming registration.",
          data: {
            artId: exactExisting._id,
            hash: contentHash
          }
        });
      } else {
        // Different creator: Conflict
        return res.status(409).json({
          status: "error",
          message: "Duplicate artwork detected (this content is already registered by another creator)"
        });
      }
    }

    // 2. Check for Similar Artworks
    if (similarityHash) {
      const similarExisting = await Art.findOne({ similarityHash, similarityMethod });
      if (similarExisting) {
        if (similarExisting.creatorBy === creatorBy) {
           // Same creator: Allow resumption
           return res.status(200).json({
            status: "ok",
            message: "Similar artwork already exists for you. Resuming registration.",
            data: {
              artId: similarExisting._id,
              hash: contentHash
            }
          });
        } else {
          // Different creator: Conflict
          return res.status(409).json({
            status: "error",
            message: "Similar artwork already exists (plagiarism check failed)"
          });
        }
      }
    }

    const art = await Art.create({
      title,
      description,
      filePath: serviceFilePath,
      fileType,
      mimeType,
      contentHash,
      similarityHash,
      similarityMethod,
      creatorBy,
      ownedBy,
      category,
      minPrice: parseFloat(minPrice)
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
    console.error("CRITICAL: Create art error:", err);
    
    if (err.message.includes("Duplicate") || err.message.includes("Similar")) {
      return res.status(409).json({
        status: "error",
        message: err.message
      });
    }

    // Return more detail in 500 to help debug
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      detail: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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


router.get("/hash/:hash", async (req, res) => {
  try {
    const art = await Art.findOne({hash: req.params.hash});
    if (!art) res.status(404).json({status:"error", message:"Art not found."});
    res.status(200).json({status:"ok", data: art});
  } catch(err){
    console.log("Error: " , err);
    res.status(500).json({status: "error", data: err});
  }
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

