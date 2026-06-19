import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

// ----------------------
// Configuration
// ----------------------
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/app_db";
const OTP_TTL_SECONDS = 30;

// ----------------------
// Redis Connection
// ----------------------
const redis = new Redis(REDIS_URL);

// ----------------------
// MongoDB Connection
// ----------------------
await mongoose.connect(MONGO_URI);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// ----------------------
// Key Helpers
// ----------------------
const BANNER_KEY = "app:banner";

function otpKey(phone) {
  return `otp:${phone}`;
}

function userHashKey(id) {
  return `user:${id}:hash`;
}

// ======================================================
// OTP Routes
// ======================================================

// Generate and store an OTP for a given phone number
app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", OTP_TTL_SECONDS);

  // NOTE: In production, send the OTP via SMS instead of returning it in the response.
  res.json({
    success: true,
    message: "OTP generated successfully",
  });
});

// Verify an OTP for a given phone number
app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone number and OTP are required",
    });
  }

  const savedOtp = await redis.get(otpKey(phone));

  if (!savedOtp) {
    return res.status(400).json({
      success: false,
      message: "OTP expired or not found",
    });
  }

  if (savedOtp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  await redis.del(otpKey(phone));

  res.json({
    success: true,
    message: "OTP verified successfully",
  });
});

// Get remaining TTL for an OTP
app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpKey(req.params.phone));

  res.json({ ttl });
});

// ======================================================
// Health Checks
// ======================================================

app.get("/health/redis", async (req, res) => {
  const reply = await redis.ping();

  res.json({
    redis: reply,
  });
});

app.get("/health/mongo", async (req, res) => {
  const state = mongoose.connection.readyState;

  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    mongo: stateMap[state] ?? "unknown",
  });
});

// ======================================================
// Banner (Redis String Example)
// ======================================================

// Create or update banner message
app.post("/banner", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  await redis.set(BANNER_KEY, message);

  res.json({
    success: true,
    message,
  });
});

// Get current banner message
app.get("/banner", async (req, res) => {
  const message = await redis.get(BANNER_KEY);

  res.json({ message });
});

// Delete banner message
app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);

  res.json({
    success: true,
    message: "Banner deleted",
  });
});

// Check if banner exists
app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);

  res.json({
    exists: Boolean(exists),
  });
});

// ======================================================
// User Hash (Redis Hash Example)
// ======================================================

// Create a user hash
app.post("/user/:id/hash", async (req, res) => {
  const { name, email, age } = req.body;

  await redis.hset(userHashKey(req.params.id), {
    name,
    email,
    age: String(age),
  });

  res.json({
    success: true,
    message: "User saved",
  });
});

// Get all fields of a user hash
app.get("/user/:id/hash", async (req, res) => {
  const user = await redis.hgetall(userHashKey(req.params.id));

  res.json(user);
});

// Get a single field from a user hash
app.get("/user/:id/hash/:field", async (req, res) => {
  const value = await redis.hget(
    userHashKey(req.params.id),
    req.params.field
  );

  res.json({
    field: req.params.field,
    value,
  });
});

// Update fields in a user hash
app.patch("/user/:id/hash", async (req, res) => {
  await redis.hset(userHashKey(req.params.id), req.body);

  res.json({
    success: true,
    updated: req.body,
  });
});

// Delete a single field from a user hash
app.delete("/user/:id/hash/:field", async (req, res) => {
  await redis.hdel(userHashKey(req.params.id), req.params.field);

  res.json({
    success: true,
    deleted: req.params.field,
  });
});

// Check if a user hash exists
app.get("/user/:id/hash/exists", async (req, res) => {
  const exists = await redis.exists(userHashKey(req.params.id));

  res.json({
    exists: Boolean(exists),
  });
});

// Delete an entire user hash
app.delete("/user/:id/hash", async (req, res) => {
  await redis.del(userHashKey(req.params.id));

  res.json({
    success: true,
    message: "User deleted",
  });
});

// ======================================================
// Start Server
// ======================================================

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});