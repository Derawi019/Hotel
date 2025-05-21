-- Create Users table
CREATE TABLE "User" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    emailVerified TIMESTAMP,
    image TEXT,
    password TEXT,
    role TEXT DEFAULT 'user'
);

-- Create Hotels table
CREATE TABLE "Hotel" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1),
    image TEXT,
    amenities TEXT[],
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings table
CREATE TABLE "Booking" (
    id TEXT PRIMARY KEY,
    userId TEXT REFERENCES "User"(id) ON DELETE CASCADE,
    hotelId TEXT REFERENCES "Hotel"(id) ON DELETE CASCADE,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Reviews table
CREATE TABLE "Review" (
    id TEXT PRIMARY KEY,
    userId TEXT REFERENCES "User"(id) ON DELETE CASCADE,
    hotelId TEXT REFERENCES "Hotel"(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Wishlist table
CREATE TABLE "Wishlist" (
    id TEXT PRIMARY KEY,
    userId TEXT REFERENCES "User"(id) ON DELETE CASCADE,
    hotelId TEXT REFERENCES "Hotel"(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, hotelId)
);

-- Create indexes for better performance
CREATE INDEX idx_hotel_location ON "Hotel"(location);
CREATE INDEX idx_booking_user ON "Booking"(userId);
CREATE INDEX idx_booking_hotel ON "Booking"(hotelId);
CREATE INDEX idx_review_hotel ON "Review"(hotelId);
CREATE INDEX idx_wishlist_user ON "Wishlist"(userId); 